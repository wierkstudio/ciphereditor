
import { BlueprintNodeId, BlueprintNodeType, BlueprintState } from 'types/blueprint'
import { Control, ControlNode } from 'types/control'
import { addNode, nextNodeId } from './blueprint'
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
  types: ['text'],
  initialValue: '',
  value: { value: '', type: 'text' },
  enum: [],
  enumStrict: true,
  enabled: true,
  writable: true,
}

/**
 * Add an empty control to the given program node id.
 * @param state Blueprint state
 * @param programId Program node id
 * @param control Control to be added
 * @returns New control node
 */
 export const addProgramControlNode = (state: BlueprintState, programId: BlueprintNodeId) => {
  const id = nextNodeId(state)
  const controlNode: ControlNode = {
    ...defaultControlNode,
    parentId: programId,
    id,
    name: `control${id}`,
    label: `Control ${id}`,
  }
  return addNode(state, controlNode)
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
    id: nextNodeId(state),
    parentId: operationId,
    label: control.label || control.name,
    value: resolveImplicitTypedValue(control.initialValue),
  }
  return addNode(state, controlNode)
}
