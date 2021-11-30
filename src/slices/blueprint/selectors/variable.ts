
import {
  BlueprintNodeId,
  BlueprintNodeType,
  BlueprintState,
} from 'types/blueprint'
import { VariableNode } from 'types/variable'
import { getNode } from './blueprint'
import { getControlNode } from './control'

/**
 * Find a variable node by the given node id.
 * @param state Blueprint state
 * @param id Node id
 * @throws If the blueprint has no node with the given id
 * @throws If the node type does not match the expected type
 * @returns Variable node
 */
export const getVariableNode = (state: BlueprintState, id: BlueprintNodeId) =>
  getNode(state, id, BlueprintNodeType.Variable) as VariableNode

/**
 * Return the variable attached to the given control within a program.
 */
export const getAttachedVariable = (
  state: BlueprintState,
  controlId: BlueprintNodeId,
  programId: BlueprintNodeId,
) => {
  const control = getControlNode(state, controlId)
  const variableId =
    control.parentId === programId
      ? control.attachedInternVariableId
      : control.attachedVariableId
  return variableId ? getVariableNode(state, variableId) : undefined
}
