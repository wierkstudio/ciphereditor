
import { Point, Rect, Size } from '@ciphereditor/library'

export type BlueprintNodeId = number

export enum BlueprintNodeType {
  Control = 'control',
  Operation = 'operation',
  Program = 'program',
  Variable = 'variable',
}

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
  type: BlueprintNodeType

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
   */
  rootProgramId: BlueprintNodeId

  /**
   * Active program node id
   * Set to undefined when leaving the root program
   */
  activeProgramId: BlueprintNodeId | undefined

  /**
   * Busy operation node ids
   */
  busyOperationIds: BlueprintNodeId[]

  /**
   * Wether to use the plane (2-dimensional) canvas suited for larger devices
   * (e.g. desktops, tablets).
   */
  planeCanvas: boolean

  /**
   * Current size of the canvas
   */
  canvasSize: Size

  /**
   * Canvas offset/position when leaving the root program
   */
  rootOffset: Point
}
