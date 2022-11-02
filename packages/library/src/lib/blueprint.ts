
import { BlueprintNode } from '../schema/blueprint'
import { ControlNode } from '../schema/control'

type NodeId = NonNullable<ControlNode['id']>

/**
 * Visit the given nodes recursively and collect node ids.
 */
export const collectNodesIds = (nodes: BlueprintNode[]): NodeId[] =>
  nodes.map((node): NodeId[] => {
    switch (node.type) {
      case 'control': {
        return node.id !== undefined ? [node.id] : []
      }
      case 'operation': {
        if (node.controls === undefined) {
          return []
        }
        return Object.values(node.controls)
          .map(control => control.id)
          .filter(id => id !== undefined) as NodeId[]
      }
      case 'program': {
        return collectNodesIds(node.children ?? [])
      }
      default: {
        return []
      }
    }
  }).flat(1)
