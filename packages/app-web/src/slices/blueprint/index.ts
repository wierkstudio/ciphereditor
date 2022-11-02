
import undoable, { excludeAction } from 'redux-undo'
import {
  addVariableFromControl,
  changeControl,
  changeControlValueToChoice,
  changeControlValueToType
} from './reducers/control'
import { Blueprint, BlueprintNode, OperationIssue, Point } from '@ciphereditor/library'
import { BlueprintNodeId, BlueprintState } from './types/blueprint'
import { ControlNodeChange } from './types/control'
import { DirectoryState } from '../directory/types'
import { OperationExecutionState } from './types/operation'
import { PayloadAction, createAction, createSlice } from '@reduxjs/toolkit'
import { addNodes, deleteNodes, layoutNode, loadBlueprint, moveNode, selectNodes } from './reducers/blueprint'
import { attachControls, attachControlToVariable, detachControlFromVariable } from './reducers/variable'
import { defaultProgramNode, moveOffset } from './reducers/program'
import { executeOperation, setOperationState } from './reducers/operation'
import { getControlNode } from './selectors/control'
import { getNode, hasNode, serializeNodes } from './selectors/blueprint'
import { getOperationNode } from './selectors/operation'
import { tryToWriteTextToClipboard } from '../../lib/utils/dom'

export const defaultBlueprintState: BlueprintState = {
  nodes: { 1: defaultProgramNode },
  lastInsertNodeId: 1,
  selectedNodeIds: [],
  rootProgramId: 1,
  activeProgramId: 1,
  rootOffset: { x: 0, y: 0 },
  busyOperationIds: []
}

/**
 * Variable to hold the current clipboard content. This can't be part of the
 * blueprint state slice as it then would be affected by redo/undo. We could
 * add the clipboard to the UI state slice but then e.g. the cut action would
 * need to make changes in two slices simultaneously.
 */
let clipboard: BlueprintNode[] | undefined

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
      const { nodes, directory } = payload
      const programId = payload.programId ?? state.activeProgramId

      // Add nodes
      const addedNodes = addNodes(state, nodes, programId, directory)

      // Select added nodes if we're in the same program
      if (addedNodes.length > 0) {
        if (programId === undefined || programId === addedNodes.at(-1)?.parentId) {
          state.selectedNodeIds = addedNodes.map(nodes => nodes.id)
        }
      }

      // If a program has been created to add the node, enter into it
      if (programId === undefined && state.activeProgramId === undefined) {
        state.activeProgramId = state.rootProgramId
      }
    },

    /**
     * Navigate to the given program
     */
    enterProgramAction: (state, { payload }: PayloadAction<{
      programId?: BlueprintNodeId
    }>) => {
      const programId = payload.programId ?? state.selectedNodeIds.at(0)
      if (programId !== undefined) {
        state.activeProgramId = programId
        state.selectedNodeIds = []
      }
    },

    /**
     * Navigate to the parent of the currently active program.
     */
    leaveProgramAction: (state, { payload }: PayloadAction<{}>) => {
      if (state.activeProgramId !== undefined) {
        state.selectedNodeIds = [state.activeProgramId]
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
        setOperationState(state, operation.id, OperationExecutionState.Ready, issues)
      } else {
        setOperationState(state, operation.id, OperationExecutionState.Error, issues)
      }
    },

    executeOperationAction: (state, { payload }: PayloadAction<{
      nodeId: BlueprintNodeId
    }>) => {
      executeOperation(state, payload.nodeId)
    },

    selectAction: (state, { payload }: PayloadAction<{
      nodeIds: BlueprintNodeId[]
    }>) => {
      selectNodes(state, payload.nodeIds)
    },

    moveAction: (state, { payload }: PayloadAction<{
      nodeIds?: BlueprintNodeId[]
      delta: Point
    }>) => {
      const nodeIds = payload.nodeIds ?? state.selectedNodeIds
      if (nodeIds.length > 0) {
        const delta = payload.delta
        nodeIds.map(id => moveNode(state, id, delta.x, delta.y, true))
      }
    },

    cutAction: (state, { payload }: PayloadAction<{
      nodeIds?: BlueprintNodeId[]
      directory?: DirectoryState
    }>) => {
      const nodeIds = payload.nodeIds ?? state.selectedNodeIds
      if (nodeIds.length > 0) {
        clipboard = serializeNodes(state, payload.directory, nodeIds)
        deleteNodes(state, nodeIds)
        tryToWriteTextToClipboard(JSON.stringify(clipboard))
      }
    },

    copyAction: (state, { payload }: PayloadAction<{
      nodeIds?: BlueprintNodeId[]
      directory?: DirectoryState
    }>) => {
      const nodeIds = payload.nodeIds ?? state.selectedNodeIds
      clipboard = serializeNodes(state, payload.directory, nodeIds)
      if (clipboard.length > 0) {
        tryToWriteTextToClipboard(JSON.stringify(clipboard))
      }
    },

    pasteAction: (state, { payload }: PayloadAction<{
      directory?: DirectoryState
    }>) => {
      if (clipboard !== undefined) {
        const programId = state.activeProgramId
        const directory = payload.directory
        const addedNodes = addNodes(state, clipboard, programId, directory)

        // Select added nodes, if any
        if (addedNodes.length > 0) {
          state.selectedNodeIds = addedNodes.map(node => node.id)
        }
      }
    },

    deleteAction: (state, { payload }: PayloadAction<{
      nodeIds?: BlueprintNodeId[]
    }>) => {
      const nodeIds = payload.nodeIds ?? state.selectedNodeIds
      deleteNodes(state, nodeIds)
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
  selectAction,
  moveAction,
  cutAction,
  copyAction,
  pasteAction,
  deleteAction,
  moveOffsetAction,
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
    toggleControlVisibility.type,
    layoutNodeAction.type
  ]),
  groupBy: (action, currentState, previousHistory) => {
    const currentGroup = previousHistory.group as number | string
    if (action.type === applyOperationResultAction.type) {
      // Group incoming operation results with the previous state as they are
      // automatic and should not be performed again when doing undo/redo
      return currentGroup
    } else if (action.type === selectAction.type) {
      // Group together consecutive changes to the selection
      return 'select'
    } else if (action.type === changeControlAction.type) {
      // User initiated changes to controls should be grouped together when they
      // refer to the same control and happen after small time intervals (30s)
      const timeUnit = Math.floor(new Date().getTime() / (60 * 1000))
      return `control-${action.payload.controlId as number}-${timeUnit}`
    } else if (action.type === moveAction.type) {
      // See case above
      const timeUnit = Math.floor(new Date().getTime() / (60 * 1000))
      const selectionIdentifier =
        ((action.payload.nodeIds ?? []) as number[]).join('')
      return `move-node-${selectionIdentifier}-${timeUnit}`
    }
    // Put this action into a separate group
    return typeof currentGroup === 'number' ? currentGroup + 1 : 1
  }
})
