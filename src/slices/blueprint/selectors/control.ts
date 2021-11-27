
import {
  BlueprintNodeId,
  BlueprintNodeType,
  BlueprintState,
} from 'types/blueprint'
import { ControlNode } from 'types/control'
import { TypedValue } from 'types/value'
import { getNode, getNodeChildren } from './blueprint'

/**
 * Find a control node by the given node id.
 * @param state Blueprint state
 * @param id Node id
 * @throws If the blueprint has no node with the given id
 * @throws If the node type does not match the expected type
 * @returns Control node
 */
export const getControlNode = (state: BlueprintState, id: BlueprintNodeId) =>
  getNode(state, id, BlueprintNodeType.Control) as ControlNode

/**
 * Return an object mapping control names to values, embedded in the given node.
 * @param state Blueprint state
 * @param nodeId Node id
 */
export const getNodeControlValues = (state: BlueprintState, nodeId: BlueprintNodeId) => {
  const controls = getNodeChildren(state, nodeId, BlueprintNodeType.Control) as ControlNode[]
  const namedValues: { [name: string]: TypedValue } = {}
  for (let i = 0; i < controls.length; i++) {
    namedValues[controls[i].name] = controls[i].value
  }
  return namedValues
}
