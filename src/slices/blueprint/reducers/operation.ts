
import { BlueprintNodeId, BlueprintNodeType, BlueprintState } from 'types/blueprint'
import { Operation, OperationNode } from 'types/operation'
import { addNode, nextNodeId } from './blueprint'
import { addOperationControlNode } from './control'

/**
 * Add an operation node to the given program.
 * @param state Blueprint state
 * @param programId Program node id
 * @param operation Operation to be added
 * @returns New operation node
 */
export const addOperationNode = (state: BlueprintState, programId: BlueprintNodeId, operation: Operation) => {
  // TODO: Where to put the operation entity name
  const operationNode: OperationNode = {
    id: nextNodeId(state),
    parentId: programId,
    type: BlueprintNodeType.Operation,
    label: operation.label,
    childIds: [],
    busy: false,
    bundleId: operation.bundleId,
    moduleId: operation.moduleId,
  }

  addNode(state, operationNode)

  // Add operation controls
  operationNode.childIds =
    operation.controls
      .map(addOperationControlNode.bind(null, state, operationNode.id))
      .map(node => node.id)

  return operationNode
}
