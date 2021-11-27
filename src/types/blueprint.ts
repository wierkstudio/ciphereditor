
export type BlueprintNodeId = number

export enum BlueprintNodeType {
  Control = 'control',
  Operation = 'operation',
  Program = 'program',
  Variable = 'variable',
}

/**
 * Blueprint node
 */
export interface BlueprintNode {
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
}

/**
 * The document tree-shaped state of the application.
 */
export interface BlueprintState {
  /**
   * Blueprint title
   */
  title: string

  /**
   * Object mapping ids to nodes
   */
  nodes: Record<number, BlueprintNode>

  /**
   * Selected node id
   */
  selectedNodeId?: BlueprintNodeId

  /**
   * Root program node id
   */
  rootProgramId: BlueprintNodeId

  /**
   * Active program node id
   */
  activeProgramId?: BlueprintNodeId

  /**
   * Busy operation node ids
   */
  busyOperationIds: BlueprintNodeId[]

  /**
   * Node id counter
   */
  nodeIdCounter: number
}
