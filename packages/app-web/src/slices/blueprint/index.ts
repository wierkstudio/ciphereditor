
import undoable, { excludeAction } from 'redux-undo'
import {
  addVariableFromControl,
  changeControl,
  changeControlValueToChoice,
  changeControlValueToType
} from './reducers/control'
import { Blueprint, BlueprintNode, OperationIssue, Point } from '@ciphereditor/library'
import { BlueprintNodeId, BlueprintState, BlueprintNodeType } from './types/blueprint'
import { ControlNodeChange } from './types/control'
import { DirectoryState } from '../directory/types'
import { OperationState } from './types/operation'
import { PayloadAction, createAction, createSlice } from '@reduxjs/toolkit'
import { addNodes, layoutNode, loadBlueprint, moveNode, removeNode, selectNode } from './reducers/blueprint'
import { attachControls, attachControlToVariable, detachControlFromVariable } from './reducers/variable'
import { defaultProgramNode, moveOffset } from './reducers/program'
import { executeOperation, setOperationState } from './reducers/operation'
import { getControlNode } from './selectors/control'
import { getNode, hasNode } from './selectors/blueprint'
import { getOperationNode } from './selectors/operation'

export const defaultBlueprintState: BlueprintState = {
  nodes: { 1: defaultProgramNode },
  lastInsertNodeId: 1,
  selectedNodeId: undefined,
  rootProgramId: 1,
  activeProgramId: 1,
  rootOffset: { x: 0, y: 0 },
  busyOperationIds: []
}

export const blueprintSlice = createSlice({
  name: 'blueprint',
  initialState: defaultBlueprintState,
  reducers: {
    /**
     * Load the given blueprint
     */
    loadBlueprintAction: (state, { payload }: PayloadAction<{
      blueprint: Blueprint
      directory?: DirectoryState
    }>) => {
      loadBlueprint(state, payload.blueprint, payload.directory)
    },

    /**
     * Add the given operation to a program
     */
    addNodesAction: (state, { payload }: PayloadAction<{
      nodes: BlueprintNode[]
      programId?: BlueprintNodeId
      directory?: DirectoryState
    }>) => {
      const programId = payload.programId ?? state.activeProgramId
      // Add the nodes
      const nodes = addNodes(state, payload.nodes, programId, payload.directory)
      // Select the last node added, if it is in the currently active program
      const lastNode = nodes.at(-1)
      if (programId === undefined || programId === lastNode?.parentId) {
        state.selectedNodeId = nodes.at(-1)?.id
      }
      // If a program has been created to add the node, enter into it
      if (programId === undefined && state.activeProgramId === undefined) {
        state.activeProgramId = state.rootProgramId
      }
    },

    /**
     * Change the active program.
     */
    enterProgramAction: (state, { payload }: PayloadAction<{
      programId?: BlueprintNodeId
    }>) => {
      const targetNodeId = payload.programId ?? state.selectedNodeId
      if (targetNodeId !== undefined) {
        state.activeProgramId = targetNodeId
        state.selectedNodeId = undefined
      }
    },

    /**
     * Move a level up, changing the active program to its parent program.
     */
    leaveProgramAction: (state, { payload }: PayloadAction<{}>) => {
      if (state.activeProgramId !== undefined) {
        state.selectedNodeId = state.activeProgramId
        if (state.rootProgramId !== state.activeProgramId) {
          state.activeProgramId = getNode(state, state.activeProgramId).parentId
        } else {
          state.activeProgramId = undefined
        }
      }
    },

    changeControlValueToChoiceAction: (state, { payload }: PayloadAction<{
      controlId: BlueprintNodeId
      choiceIndex: number
    }>) => {
      changeControlValueToChoice(state, payload.controlId, payload.choiceIndex)
    },

    changeControlValueToTypeAction: (state, { payload }: PayloadAction<{
      controlId: BlueprintNodeId
      valueType: string
    }>) => {
      changeControlValueToType(state, payload.controlId, payload.valueType)
    },

    attachControlToVariableAction: (state, { payload }: PayloadAction<{
      controlId: BlueprintNodeId
      variableId: BlueprintNodeId
      push: boolean
    }>) => {
      const { controlId, variableId, push } = payload
      attachControlToVariable(state, controlId, variableId, true, push)
    },

    detachControlFromVariableAction: (state, { payload }: PayloadAction<{
      controlId: BlueprintNodeId
      variableId: BlueprintNodeId
    }>) => {
      detachControlFromVariable(state, payload.controlId, payload.variableId)
    },

    toggleControlVisibility: (state, { payload }: PayloadAction<{
      controlId: BlueprintNodeId
    }>) => {
      const control = getControlNode(state, payload.controlId)
      if (control.visibility === 'collapsed') {
        control.visibility = 'expanded'
      } else if (control.visibility === 'expanded') {
        control.visibility = 'collapsed'
      }
    },

    addVariableFromControlAction: (state, { payload }: PayloadAction<{
      controlId: BlueprintNodeId
      outward: boolean
    }>) => {
      addVariableFromControl(state, payload.controlId, payload.outward)
    },

    attachControlsAction: (state, { payload }: PayloadAction<{
      sourceControlId: BlueprintNodeId
      targetControlId: BlueprintNodeId
      outward: boolean
    }>) => {
      const { sourceControlId, targetControlId, outward } = payload
      attachControls(state, sourceControlId, targetControlId, outward)
    },

    /**
     * Apply control changes to the given parent node.
     */
    changeControlAction: (state, { payload }: PayloadAction<{
      controlId: BlueprintNodeId
      change: ControlNodeChange
    }>) => {
      changeControl(state, payload.controlId, payload.change)
    },

    /**
     * Apply an operation result to the blueprint.
     */
    applyOperationResultAction: (state, { payload }: PayloadAction<{
      operationId: BlueprintNodeId
      requestVersion: number
      changes: ControlNodeChange[]
      changeControlIds: BlueprintNodeId[]
      issues: OperationIssue[]
    }>) => {
      const { operationId, requestVersion, changes, changeControlIds, issues } = payload
      if (!hasNode(state, operationId)) {
        // Operation node has been removed while being busy
        return
      }

      const operation = getOperationNode(state, operationId)
      if (operation.requestVersion !== requestVersion) {
        // A request version mismatch implies that the control values have
        // changed while processing the operation request.
        // The processor middleware will check wether the operation stays busy
        // and if so, handle the new request from scratch.
        return
      }

      // A result bearing no issues of type 'error' is considered successful
      const success = issues?.find(issue => issue.level === 'error') === undefined
      if (success) {
        for (let i = 0; i < changes.length; i++) {
          changeControl(state, changeControlIds[i], changes[i])
        }
        setOperationState(state, operation.id, OperationState.Ready, issues)
      } else {
        setOperationState(state, operation.id, OperationState.Error, issues)
      }
    },

    executeOperationAction: (state, { payload }: PayloadAction<{
      nodeId: BlueprintNodeId
    }>) => {
      executeOperation(state, payload.nodeId)
    },

    /**
     * Select a node or clear the selection.
     */
    selectNodeAction: (state, { payload }: PayloadAction<{
      nodeId?: BlueprintNodeId
    }>) => {
      selectNode(state, payload.nodeId)
    },

    /**
     * Remove a node.
     */
    removeNodeAction: (state, { payload }: PayloadAction<{
      nodeId?: BlueprintNodeId
    }>) => {
      const nodeId = payload.nodeId ?? state.selectedNodeId
      if (nodeId !== undefined) {
        // Check wether removal is allowed
        const node = getNode(state, nodeId)
        const parent = getNode(state, node.parentId)
        if (
          node.type === BlueprintNodeType.Control &&
          parent.type === BlueprintNodeType.Operation
        ) {
          return
        }

        removeNode(state, nodeId)
      }
    },

    /**
     * Move the canvas offset/position of the active program
     */
    moveOffsetAction: (state, { payload }: PayloadAction<{
      offset: Point
      relative?: boolean
    }>) => {
      moveOffset(state, payload.offset, payload.relative ?? false)
    },

    moveNodeAction: (state, { payload }: PayloadAction<{
      nodeId?: BlueprintNodeId
      x: number
      y: number
    }>) => {
      const nodeId = payload.nodeId ?? state.selectedNodeId
      if (nodeId !== undefined) {
        moveNode(state, nodeId, payload.x, payload.y, true)
      }
    },

    layoutNodeAction: (state, { payload }: PayloadAction<{
      nodeId: number
      width: number | undefined
      height: number | undefined
      outletPositions?: Array<{
        controlId: BlueprintNodeId
        x: number | undefined
        y: number | undefined
      }>
    }>) => {
      const { nodeId, width, height, outletPositions } = payload

      if (width !== undefined && height !== undefined) {
        layoutNode(state, nodeId, width, height)
      }

      if (outletPositions !== undefined) {
        outletPositions.forEach(position => {
          const control = getControlNode(state, position.controlId)
          control.nodeOutletX = position.x
          control.nodeOutletY = position.y
        })
      }
    }
  }
})

export const {
  loadBlueprintAction,
  addNodesAction,
  enterProgramAction,
  leaveProgramAction,
  changeControlAction,
  changeControlValueToChoiceAction,
  changeControlValueToTypeAction,
  attachControlToVariableAction,
  detachControlFromVariableAction,
  toggleControlVisibility,
  addVariableFromControlAction,
  attachControlsAction,
  applyOperationResultAction,
  executeOperationAction,
  selectNodeAction,
  removeNodeAction,
  moveOffsetAction,
  moveNodeAction,
  layoutNodeAction
} = blueprintSlice.actions

export const undoAction = createAction(`${blueprintSlice.name}/undoAction`)
export const redoAction = createAction(`${blueprintSlice.name}/redoAction`)

export default undoable(blueprintSlice.reducer, {
  limit: 50,
  undoType: undoAction.type,
  redoType: redoAction.type,
  filter: excludeAction([
    // Szenario: The user wants to copy something from the undo past
    // The undo history must stay intact when navigating or selecting
    enterProgramAction.type,
    leaveProgramAction.type,
    selectNodeAction.type,
    toggleControlVisibility.type,
    layoutNodeAction.type
  ]),
  groupBy: (action, currentState, previousHistory) => {
    const currentGroup = previousHistory.group as number | string
    if (action.type === applyOperationResultAction.type) {
      // Group incoming operation results with the previous state as they are
      // automatic and should not be performed again when doing undo/redo
      return currentGroup
    } else if (action.type === changeControlAction.type) {
      // User initiated changes to controls should be grouped together when they
      // refer to the same control and happen after small time intervals (30s)
      const timeUnit = Math.floor(new Date().getTime() / (60 * 1000))
      return `control-${action.payload.controlId as number}-${timeUnit}`
    } else if (action.type === moveNodeAction.type) {
      // See case above
      const timeUnit = Math.floor(new Date().getTime() / (60 * 1000))
      return `move-node-${action.payload.nodeId as number}-${timeUnit}`
    }
    // Put this action into a separate group
    return typeof currentGroup === 'number' ? currentGroup + 1 : 1
  }
})
