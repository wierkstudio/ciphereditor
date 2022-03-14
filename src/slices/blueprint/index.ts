
import undoable, { excludeAction } from 'redux-undo'
import {
  addProgramControlNode,
  addVariableFromControl,
  changeControl,
  changeControlValueToChoice,
  changeControlValueToType,
} from './reducers/control'
import { BlueprintNodeId, BlueprintState } from './types/blueprint'
import { ControlChange, ControlChangeSource, ControlViewState, NamedControlChange } from './types/control'
import { Operation, OperationState } from './types/operation'
import { PayloadAction, createAction, createSlice } from '@reduxjs/toolkit'
import { addEmptyProgramNode, defaultProgramNode } from './reducers/program'
import { addOperationNode, setOperationState } from './reducers/operation'
import { getNode, hasNode } from './selectors/blueprint'
import { getOperationNode } from './selectors/operation'
import { removeNode, selectNode } from './reducers/blueprint'
import { attachControlToVariable, detachControlFromVariable } from './reducers/variable'
import { getControlNode, getNodeNamedControls } from './selectors/control'
import { BlueprintNodeType } from './types/blueprint'

const defaultBlueprintState: BlueprintState = {
  title: 'New Blueprint',
  nodes: { 1: defaultProgramNode },
  lastInsertNodeId: 1,
  selectedNodeId: undefined,
  rootProgramId: 1,
  activeProgramId: 1,
  busyOperationIds: [],
}

export const blueprintSlice = createSlice({
  name: 'blueprint',
  initialState: defaultBlueprintState,
  reducers: {
    /**
     * Instantiate a operation and add it to the target program
     */
    addOperationAction: (state, { payload }: PayloadAction<{
      programId: BlueprintNodeId,
      operation: Operation,
      x: number,
      y: number,
    }>) => {
      const { programId, operation, x, y } = payload
      addOperationNode(state, programId, operation, x, y)
    },

    /**
     * Add an empty program to the target program
     * If no program is given, it will be added to the active program
     */
    addEmptyProgramAction: (state, { payload }: PayloadAction<{
      programId?: BlueprintNodeId,
      x: number,
      y: number,
    }>) => {
      // TODO: Handle no active program
      const { programId, x, y } = payload
      addEmptyProgramNode(state, programId ?? state.activeProgramId, x, y)
    },

    /**
     * Change the active program.
     */
    enterProgramAction: (state, { payload }: PayloadAction<{
      programId?: BlueprintNodeId,
    }>) => {
      const targetNodeId = payload.programId || state.selectedNodeId
      if (targetNodeId !== undefined) {
        state.activeProgramId = targetNodeId
        state.selectedNodeId = undefined
        state.linkControlId = undefined
      }
    },

    /**
     * Move a level up, changing the active program to its parent program.
     */
    leaveProgramAction: (state, { payload }: PayloadAction<{}>) => {
      if (state.activeProgramId && state.activeProgramId !== state.rootProgramId) {
        state.activeProgramId = getNode(state, state.activeProgramId).parentId
        state.selectedNodeId = undefined
        state.linkControlId = undefined
      }
    },

    /**
     * Add an empty control node to the given program.
     */
    addEmptyControlAction: (state, { payload }: PayloadAction<{
      programId: BlueprintNodeId,
      x: number,
      y: number,
    }>) => {
      addProgramControlNode(state, payload.programId, payload.x, payload.y)
    },

    changeControlValueToChoiceAction: (state, { payload }: PayloadAction<{
      controlId: BlueprintNodeId,
      choiceIndex: number,
    }>) => {
      changeControlValueToChoice(state, payload.controlId, payload.choiceIndex)
    },

    changeControlValueToTypeAction: (state, { payload }: PayloadAction<{
      controlId: BlueprintNodeId,
      valueType: string,
    }>) => {
      changeControlValueToType(state, payload.controlId, payload.valueType)
    },

    attachControlToVariableAction: (state, { payload }: PayloadAction<{
      controlId: BlueprintNodeId,
      variableId: BlueprintNodeId,
      push: boolean,
    }>) => {
      const { controlId, variableId, push } = payload
      attachControlToVariable(state, controlId, variableId, true, push)
    },

    detachControlFromVariableAction: (state, { payload }: PayloadAction<{
      controlId: BlueprintNodeId,
      variableId: BlueprintNodeId,
    }>) => {
      detachControlFromVariable(state, payload.controlId, payload.variableId)
    },

    toggleControlViewState:  (state, { payload }: PayloadAction<{
      controlId: BlueprintNodeId,
    }>) => {
      const control = getControlNode(state, payload.controlId)
      if (control.viewState === ControlViewState.Collapsed) {
        control.viewState = ControlViewState.Expanded
      } else if (control.viewState === ControlViewState.Expanded) {
        control.viewState = ControlViewState.Collapsed
      }
    },

    addVariableFromControlAction: (state, { payload }: PayloadAction<{
      controlId: BlueprintNodeId,
      programId: BlueprintNodeId,
    }>) => {
      addVariableFromControl(state, payload.controlId, payload.programId)
    },

    /**
     * Apply control changes to the given parent node.
     */
    changeControlAction: (state, { payload }: PayloadAction<{
      controlId: BlueprintNodeId,
      change: ControlChange,
    }>) => {
      changeControl(state, payload.controlId, payload.change, ControlChangeSource.UserInput)
    },

    /**
     * Apply an operation task result to the blueprint.
     */
    applyOperationTaskResultAction: (state, { payload }: PayloadAction<{
      operationId: BlueprintNodeId,
      taskVersion: number,
      controlChanges: NamedControlChange[],
      error?: string,
    }>) => {
      const { operationId, taskVersion, controlChanges, error } = payload
      if (!hasNode(state, operationId)) {
        // Operation node has been removed while being busy
        return
      }
      const operation = getOperationNode(state, operationId)
      if (operation.taskVersion !== taskVersion) {
        // A task version mismatch implies that the control values have changed
        // while completing the operation task; It needs to be redone
        console.log('Operation task needs to be redone')
        return
      }
      if (!error) {
        console.log('Operation task completed', controlChanges)
        const namedControls = getNodeNamedControls(state, operationId)
        controlChanges.forEach(change => {
          const control = namedControls[change.name]
          // TODO: Validate wether control exists and is enabled and handle it
          // TODO: Validate change set
          changeControl(state, control.id, change, ControlChangeSource.Parent)
        })
        setOperationState(state, operation, OperationState.Ready)
      } else {
        console.error('Operation task failed', error)
        setOperationState(state, operation, OperationState.Failed)
      }
    },

    /**
     * Select a node or clear the selection.
     */
    selectNodeAction: (state, { payload }: PayloadAction<{
      nodeId?: BlueprintNodeId,
    }>) => {
      selectNode(state, payload.nodeId)
    },

    /**
     * Remove a node.
     */
    removeNodeAction: (state, { payload }: PayloadAction<{
      nodeId?: BlueprintNodeId,
    }>) => {
      const nodeId = payload.nodeId ?? state.selectedNodeId
      if (nodeId) {
        // Check wether removal is allowed
        const node = getNode(state, nodeId)
        const parent = getNode(state, node.parentId)
        if (node.type === BlueprintNodeType.Control && parent.type === BlueprintNodeType.Operation) {
          return
        }

        removeNode(state, nodeId)
      }
    },

    moveNodeAction: (state, { payload }: PayloadAction<{
      nodeId: BlueprintNodeId,
      x: number,
      y: number,
    }>) => {
      const node = getNode(state, payload.nodeId)
      node.x = payload.x
      node.y = payload.y
    },
  }
})

export const {
  addOperationAction,
  addEmptyProgramAction,
  enterProgramAction,
  leaveProgramAction,
  addEmptyControlAction,
  changeControlAction,
  changeControlValueToChoiceAction,
  changeControlValueToTypeAction,
  attachControlToVariableAction,
  detachControlFromVariableAction,
  toggleControlViewState,
  addVariableFromControlAction,
  applyOperationTaskResultAction,
  selectNodeAction,
  removeNodeAction,
  moveNodeAction,
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
    toggleControlViewState.type,
  ]),
  groupBy: (action, currentState, previousHistory) => {
    const currentGroup = previousHistory.group
    if (action.type === applyOperationTaskResultAction.type) {
      // Group incoming operation results with the previous state as they are
      // automatic and should not be performed again when doing undo/redo
      return currentGroup
    } else if (action.type === changeControlAction.type) {
      // User initiated changes to controls should be grouped together when they
      // refer to the same control and happen after small time intervals (30s)
      const timeUnit = Math.floor(new Date().getTime() / (60 * 1000))
      return `control-${action.payload.controlId}-${timeUnit}`
    } else if (action.type === moveNodeAction.type) {
      // See case above
      const timeUnit = Math.floor(new Date().getTime() / (60 * 1000))
      return `move-node-${action.payload.nodeId}-${timeUnit}`
    }
    // Put this action into a separate group
    return Number.isInteger(currentGroup) ? currentGroup + 1 : 1
  }
})
