
import { BlueprintNodeId, BlueprintNodeType, BlueprintState } from 'types/blueprint'
import { ControlChangeSource } from 'types/control'
import { VariableNode } from 'types/variable'
import { arrayUniquePush, arrayUniqueUnshift } from 'utils/array'
import { getControlNode } from '../selectors/control'
import { getControlVariable, getVariableNode } from '../selectors/variable'
import { addNode, nextNodeId, removeNode } from './blueprint'
import { changeControl } from './control'

/**
 * Create new variable within the given program and attach it to a control.
 */
export const addVariable = (
  state: BlueprintState,
  programId: BlueprintNodeId,
  controlId: BlueprintNodeId,
) => {
  const variable: VariableNode = {
    type: BlueprintNodeType.Variable,
    id: nextNodeId(state),
    parentId: programId,
    childIds: [],
    attachmentIds: [controlId],
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
  programId: BlueprintNodeId,
) => {
  const sourceControl = getControlNode(state, sourceControlId)
  const targetControl = getControlNode(state, targetControlId)

  // Prevent linking controls from the same parent operation or program
  if (sourceControl.parentId === targetControl.parentId) {
    return
  }

  // Retrieve attached variables
  let sourceVariable = getControlVariable(state, sourceControl.id, programId)
  let targetVariable = getControlVariable(state, targetControl.id, programId)

  // If both controls are already linked up, there's nothing to be done
  if (sourceVariable !== undefined && sourceVariable.id === targetVariable?.id) {
    return
  }

  // We're at a crossroads: There are 4 possible cases we need to handle
  // We should end up with both controls being part of one variable
  if (sourceVariable === undefined && targetVariable === undefined) {
    // 1. Both controls are not attached to any variable
    // Create a new variable and attach both controls to it
    sourceVariable = addVariable(state, programId, sourceControl.id)
    attachControlToVariable(state, targetControl.id, sourceVariable.id)
  } else if (sourceVariable !== undefined && targetVariable !== undefined) {
    // 2. Both controls are already attached to a variable each
    // Remove the target variable and move controls over to the source variable
    const mergeControlIds = targetVariable.attachmentIds
    removeNode(state, targetVariable.id)
    mergeControlIds.forEach(id =>
      attachControlToVariable(state, id, sourceVariable!.id))
    targetVariable = undefined
  } else if (sourceVariable !== undefined) {
    // 3. The source control is attached to a variable but the target is not
    attachControlToVariable(state, targetControl.id, sourceVariable.id)
  } else {
    // 4. The target control is attached to a variable but the source is not
    attachControlToVariable(state, targetControl.id, targetVariable!.id)
    sourceVariable = targetVariable!
  }

  // Propagate change from source within the program scope
  propagateChange(state, sourceControl.id, programId)
}

/**
 * Attach the given control to a variable.
 */
export const attachControlToVariable = (
  state: BlueprintState,
  controlId: BlueprintNodeId,
  variableId: BlueprintNodeId,
  propagate: boolean = false,
) => {
  const control = getControlNode(state, controlId)
  const variable = getVariableNode(state, variableId)
  // Add reference to control to the variable
  variable.attachmentIds = arrayUniquePush(variable.attachmentIds, control.id)
  // Add reference to the variable to the control
  if (control.parentId === variable.parentId) {
    control.attachedInternVariableId = variable.id
  } else {
    control.attachedVariableId = variable.id
  }
  // TODO: Prevent circular links
  // Propagate if requested
  if (propagate) {
    propagateChange(state, control.id, variable.parentId)
  }
}

/**
 * Propagate from the given control id to its attached variables.
 */
export const propagateChange = (
  state: BlueprintState,
  controlId: BlueprintNodeId,
  programId: BlueprintNodeId,
) => {
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
        ControlChangeSource.Variable,
        variable.id,
      )
    }
  }
}
