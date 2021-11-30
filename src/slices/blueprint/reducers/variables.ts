
import { BlueprintNodeId, BlueprintNodeType, BlueprintState } from 'types/blueprint'
import { ControlChangeSource, ControlNode } from 'types/control'
import { VariableNode } from 'types/variable'
import { arrayUniquePush } from 'utils/array'
import { getControlNode } from '../selectors/control'
import { getAttachedVariable } from '../selectors/variable'
import { addNode, nextNodeId, removeNode } from './blueprint'
import { changeControl } from './control'

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
  let sourceVariable = getAttachedVariable(state, sourceControl.id, programId)
  let targetVariable = getAttachedVariable(state, targetControl.id, programId)

  // If both controls are already linked up, there's nothing to be done
  if (sourceVariable !== undefined && sourceVariable.id === targetVariable?.id) {
    return
  }

  // TODO: Prevent circular links

  // We're at a crossroads: There are 4 possible cases we need to handle
  // We should end up with both controls being part of one variable
  if (sourceVariable === undefined && targetVariable === undefined) {
    // 1. Both controls are not attached to any variable
    // Create a new variable and attach both controls to it
    sourceVariable = {
      type: BlueprintNodeType.Variable,
      id: nextNodeId(state),
      parentId: programId,
      childIds: [],
      attachmentIds: [],
    }
    addNode(state, sourceVariable)
    attachVariable(state, sourceControl, sourceVariable)
    attachVariable(state, targetControl, sourceVariable)
  } else if (sourceVariable !== undefined && targetVariable !== undefined) {
    // 2. Both controls are already attached to a variable each
    // Remove the target variable and move controls over to the source variable
    const mergeControlIds = targetVariable.attachmentIds
    removeNode(state, targetVariable.id)
    mergeControlIds.forEach(id =>
      attachVariable(state, getControlNode(state, id), sourceVariable!))
    targetVariable = undefined
  } else if (sourceVariable !== undefined) {
    // 3. The source control is attached to a variable but the target is not
    attachVariable(state, targetControl, sourceVariable)
  } else {
    // 4. The target control is attached to a variable but the source is not
    attachVariable(state, targetControl, targetVariable!)
    sourceVariable = targetVariable!
  }

  // Propagate change from source within the program scope
  propagateChange(state, sourceControl.id, programId)
}

/**
 * Attach the given control to a variable.
 * Value propagation needs to be handled by the caller.
 */
export const attachVariable = (
  state: BlueprintState,
  control: ControlNode,
  variable: VariableNode,
) => {
  // Add reference to control to the variable
  variable.attachmentIds = arrayUniquePush(variable.attachmentIds, control.id)
  // Add reference to the variable to the control
  if (control.parentId === variable.parentId) {
    control.attachedInternVariableId = variable.id
  } else {
    control.attachedVariableId = variable.id
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
  const control = getControlNode(state, controlId)
  const variable = getAttachedVariable(state, controlId, programId)
  if (variable === undefined) {
    return
  }
  variable.attachmentIds.forEach(attachedControlId => {
    if (attachedControlId !== controlId) {
      changeControl(
        state,
        attachedControlId,
        { value: control.value },
        ControlChangeSource.Variable,
        variable.id,
      )
    }
  })
}
