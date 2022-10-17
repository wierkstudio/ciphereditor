
import { BlueprintNodeId, BlueprintNodeType, BlueprintState } from '../types/blueprint'
import { ControlNodeChangeSource } from '../types/control'
import { VariableNode } from '../types/variable'
import { addNode, nextNodeId, removeNode } from './blueprint'
import { arrayRemove, arrayUniquePush, arrayUniqueUnshift } from '../../../lib/utils/array'
import { canAttachControls, getControlNode } from '../selectors/control'
import { changeControl } from './control'
import { getControlVariable, getVariableControl, getVariableNode } from '../selectors/variable'

/**
 * Create new variable within the given program and attach it to a control.
 */
export const addVariable = (
  state: BlueprintState,
  programId: BlueprintNodeId,
  controlId: BlueprintNodeId
): VariableNode => {
  const variable: VariableNode = {
    type: BlueprintNodeType.Variable,
    id: nextNodeId(state),
    parentId: programId,
    childIds: [],
    attachmentIds: [controlId]
  }
  addNode(state, variable)
  attachControlToVariable(state, controlId, variable.id, false)
  return variable
}

/**
 * Attach the given controls with each other through a common variable.
 */
export const attachControls = (
  state: BlueprintState,
  sourceControlId: BlueprintNodeId,
  targetControlId: BlueprintNodeId,
  contextProgramId: BlueprintNodeId
): void => {
  const sourceControl = getControlNode(state, sourceControlId)
  const targetControl = getControlNode(state, targetControlId)

  // Check if attachment is available
  if (!canAttachControls(state, sourceControlId, targetControlId, contextProgramId)) {
    return
  }

  // Retrieve attached variables
  let sourceVariable = getControlVariable(state, sourceControl.id, contextProgramId)
  let targetVariable = getControlVariable(state, targetControl.id, contextProgramId)

  // If both controls are already linked up, there's nothing to be done
  if (sourceVariable !== undefined && sourceVariable.id === targetVariable?.id) {
    return
  }

  // We're at a crossroads: There are 4 possible cases we need to handle
  // We should end up with both controls being part of one variable
  if (sourceVariable === undefined && targetVariable === undefined) {
    // 1. Both controls are not attached to any variable
    // Create a new variable and attach both controls to it
    sourceVariable = addVariable(state, contextProgramId, sourceControl.id)
    attachControlToVariable(state, targetControl.id, sourceVariable.id)
  } else if (sourceVariable !== undefined && targetVariable !== undefined) {
    // 2. Both controls are already attached to a variable each
    // Remove the target variable and move controls over to the source variable
    const mergeControlIds = targetVariable.attachmentIds
    removeNode(state, targetVariable.id)
    for (const mergeControlId of mergeControlIds) {
      attachControlToVariable(state, mergeControlId, sourceVariable.id)
    }
    targetVariable = undefined
  } else if (sourceVariable !== undefined) {
    // 3. The source control is attached to a variable but the target is not
    attachControlToVariable(state, targetControl.id, sourceVariable.id)
  } else if (targetVariable !== undefined) {
    // 4. The target control is attached to a variable but the source is not
    attachControlToVariable(state, sourceControl.id, targetVariable.id)
    sourceVariable = targetVariable
  }

  // Propagate change from source within the program scope
  propagateChange(state, sourceControl.id, contextProgramId)
}

/**
 * Attach the given control to a variable.
 * @param push Wether to push the value from the control to the variable
 */
export const attachControlToVariable = (
  state: BlueprintState,
  controlId: BlueprintNodeId,
  variableId: BlueprintNodeId,
  propagate: boolean = false,
  push: boolean = true
): void => {
  const control = getControlNode(state, controlId)
  const variable = getVariableNode(state, variableId)
  const intern = control.parentId === variable.parentId
  // Break up before entering a new connection
  if (intern && control.attachedInternVariableId !== undefined) {
    detachControlFromVariable(state, controlId, control.attachedInternVariableId)
  } else if (!intern && control.attachedVariableId !== undefined) {
    detachControlFromVariable(state, controlId, control.attachedVariableId)
  }
  // Add reference to control to the variable
  variable.attachmentIds = arrayUniquePush(variable.attachmentIds, control.id)
  // Add reference to the variable to the control
  if (intern) {
    control.attachedInternVariableId = variable.id
  } else {
    control.attachedVariableId = variable.id
  }
  // Propagate if requested
  if (propagate) {
    if (push) {
      // Propagate the value from this control
      propagateChange(state, control.id, variable.parentId)
    } else {
      // Propagate from the current variable source control (pulling the value
      // into this control)
      const sourceControl = getVariableControl(state, variableId)
      propagateChange(state, sourceControl.id, variable.parentId)
    }
  }
}

/**
 * Detach a control from the given variable.
 */
export const detachControlFromVariable = (
  state: BlueprintState,
  controlId: BlueprintNodeId,
  variableId: BlueprintNodeId
): void => {
  const control = getControlNode(state, controlId)
  const variable = getVariableNode(state, variableId)
  // Detach from each other
  variable.attachmentIds = arrayRemove(variable.attachmentIds, controlId)
  if (control.attachedInternVariableId === variableId) {
    control.attachedInternVariableId = undefined
  } else if (control.attachedVariableId === variableId) {
    control.attachedVariableId = undefined
  }
  // Clean up dangling variable
  if (variable.attachmentIds.length === 0) {
    removeNode(state, variableId)
  }
}

/**
 * Propagate from the given control id to its attached variables.
 */
export const propagateChange = (
  state: BlueprintState,
  controlId: BlueprintNodeId,
  programId: BlueprintNodeId
): void => {
  // Retrieve attached variable, if any
  const control = getControlNode(state, controlId)
  const variable = getControlVariable(state, controlId, programId)
  if (variable !== undefined) {
    // Move the control a value was last propagated from to the front
    variable.attachmentIds = arrayUniqueUnshift(variable.attachmentIds, controlId)
    // Propagate through controls other than the source
    for (let i = 1; i < variable.attachmentIds.length; i++) {
      changeControl(
        state,
        variable.attachmentIds[i],
        { value: control.value },
        ControlNodeChangeSource.Variable,
        variable.id
      )
    }
  }
}
