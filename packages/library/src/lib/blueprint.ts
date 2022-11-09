
import { BlueprintNode } from '../schema/blueprint'
import { ControlNode } from '../schema/control'
import { Rect } from '../schema/2d'
import { mergeRects } from './2d'

type NodeId = NonNullable<ControlNode['id']>

/**
 * Get the frame of the given node, if defined and if set.
 */
export const getBlueprintNodeFrame = (node: BlueprintNode): Rect | undefined =>
  node.type !== 'variable' ? node.frame : undefined

/**
 * Compute the rect obtained by merging the frames of the given nodes together.
 * Return `undefined` when no frames are set (as they are optional).
 */
export const getCombinedBlueprintNodesRect = (
  nodes: BlueprintNode[]
): Rect | undefined =>
  nodes.reduce<Rect | undefined>((rect, node) => {
    const frame = getBlueprintNodeFrame(node)
    if (rect === undefined) {
      return frame
    } else if (frame === undefined) {
      return rect
    } else {
      return mergeRects(rect, frame)
    }
  }, undefined)

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
