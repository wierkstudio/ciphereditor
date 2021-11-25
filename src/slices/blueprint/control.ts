
import { BlueprintNodeId, BlueprintNodeType, BlueprintState } from '../../types/blueprint'
import { Control, ControlNode } from '../../types/control'
import { addNode, findNode } from './blueprint'
import { resolveImplicitTypedValue } from './value'

/**
 * Default control node object
 */
export const defaultControlNode: ControlNode = {
  id: -1,
  type: BlueprintNodeType.Control,
  parentId: -1,
  childIds: [],
  name: '',
  label: '',
  types: [],
  initialValue: 0,
  value: { value: 0, type: 'integer' },
  enum: [],
  enumStrict: true,
  enabled: true,
  writable: true,
}

/**
 * Find a control node by the given node id.
 * @param state Blueprint state
 * @param id Node id
 * @throws If the blueprint has no node with the given id
 * @throws If the node type does not match the expected type
 * @returns Control node
 */
export const findControlNode = (state: BlueprintState, id: BlueprintNodeId) => {
  return findNode(state, id, BlueprintNodeType.Control) as ControlNode
}

/**
 * Add a control to the given operation node id.
 * @param state Blueprint state
 * @param operationId Operation node id
 * @param control Control to be added
 * @returns New control node
 */
export const addOperationControlNode = (state: BlueprintState, operationId: BlueprintNodeId, control: Control) => {
  const controlNode: ControlNode = {
    ...defaultControlNode,
    ...control,
    parentId: operationId,
    label: control.label || control.name,
    value: resolveImplicitTypedValue(control.initialValue),
  }
  return addNode(state, controlNode)
}
