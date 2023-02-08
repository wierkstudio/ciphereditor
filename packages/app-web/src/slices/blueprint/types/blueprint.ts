
import { Point, Rect, Size } from '@ciphereditor/library'

export type BlueprintNodeId = number

/**
 * Abstract node within the blueprint state
 */
export interface BlueprintNodeState {
  /**
   * Node id unique within a blueprint
   */
  id: BlueprintNodeId

  /**
   * Node type
   */
  type: 'control' | 'operation' | 'program' | 'variable'

  /**
   * Id of the parent node this is a child of;
   * If this is a root node, the parent id is set to the node's own id
   */
  parentId: BlueprintNodeId

  /**
   * Array of child node ids
   */
  childIds: BlueprintNodeId[]

  /**
   * Original node label
   */
  label: string

  /**
   * Node label after renaming it
   */
  alias?: string

  /**
   * Size and position of the node, if applicable
   */
  frame?: Rect
}

/**
 * The tree-shaped document state of the application
 */
export interface BlueprintState {
  /**
   * Object mapping ids to nodes
   */
  nodes: Record<number, BlueprintNodeState>

  /**
   * Last insert node id (used for id generation)
   */
  lastInsertNodeId: BlueprintNodeId

  /**
   * Selected node ids
   */
  selectedNodeIds: BlueprintNodeId[]

  /**
   * Root program node id
   * A blueprint always contains a root program.
   */
  rootProgramId: BlueprintNodeId

  /**
   * Active program node id
   * Set to `undefined` when leaving the root program
   */
  activeProgramId: BlueprintNodeId | undefined

  /**
   * Busy operation node ids
   * This is a lookup array, to avoid iterating over all nodes after every
   * action is run in the extension middleware. The execution state of an
   * operation node is also stored in the node itself.
   */
  busyOperationIds: BlueprintNodeId[]

  /**
   * Wether to use the plane (2-dimensional) canvas suited for larger devices
   * (e.g. desktops, tablets). If set to `false` the line (1-dimensional) canvas
   * mode is used where nodes are placed behind each other.
   */
  planeCanvas: boolean

  /**
   * Current size of the plane (2-dimensional) canvas
   */
  canvasSize: Size

  /**
   * Plane canvas offset/position when leaving the root program
   */
  rootOffset: Point
}
