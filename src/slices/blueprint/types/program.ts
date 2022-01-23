
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
}
