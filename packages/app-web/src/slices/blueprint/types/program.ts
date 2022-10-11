
import { Rect } from '../../../lib/utils/2d'
import { BlueprintNode, BlueprintNodeType } from './blueprint'

/**
 * Program node
 * A program contains operations, controls and variables connecting all of
 * them together.
 */
export interface ProgramNode extends BlueprintNode {
  /**
   * Node type
   */
  type: BlueprintNodeType.Program

  /**
   * Program label
   */
  label: string

  /**
   * Position and size of the boundary that includes all layed out child nodes.
   * Set to `undefined` if no layed out child nodes are present.
   */
  contentBounds?: Rect
}
