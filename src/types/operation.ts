
import { BlueprintNode, BlueprintNodeType } from './blueprint'
import { Control } from './control';

/**
 * Operation entity
 */
export interface Operation {
  /**
   * Unique operation entity name
   */
  name: string

  /**
   * Operation label
   */
  label: string

  /**
   * Array of control configurations
   */
  controls: Control[]

  /**
   * Bundle identifier
   */
  bundleId: string

  /**
   * Bundle module id
   */
  moduleId: string
}

/**
 * Operation node
 */
export interface OperationNode extends BlueprintNode {
  /**
   * Node type
   */
  type: BlueprintNodeType.Operation

  /**
   * Operation label
   */
  label: string

  /**
   * True, if awaiting response from operation
   */
  busy: boolean

  /**
   * Bundle identifier
   */
  bundleId: string

  /**
   * Bundle module id
   */
  moduleId: string
}
