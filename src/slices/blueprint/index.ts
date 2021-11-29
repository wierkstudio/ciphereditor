
import { BlueprintNodeId, BlueprintState } from 'types/blueprint'
import { ControlChange, ControlChangeSource, NamedControlChange } from 'types/control'
import { Operation, OperationState } from 'types/operation'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { addEmptyProgramNode, defaultProgramNode } from './reducers/program'
import { addOperationNode, setOperationState } from './reducers/operation'
import { addProgramControlNode, changeControl } from './reducers/control'
import { getNode, hasNode } from './selectors/blueprint'
import { getOperationNode } from './selectors/operation'
import { removeNode, selectNode } from './reducers/blueprint'
import { linkControls } from './reducers/variables'
import { getNodeNamedControls } from './selectors/control'

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
    }>) => {
      addOperationNode(state, payload.programId, payload.operation)
    },

    /**
     * Add an empty program to the target program
     * If no program is given, it will be added to the active program
     */
    addEmptyProgramAction: (state, { payload }: PayloadAction<{
      programId?: BlueprintNodeId,
    }>) => {
      // TODO: Handle no active program
      addEmptyProgramNode(state, payload.programId ?? state.activeProgramId)
    },

    /**
     * Change the active program.
     */
    enterProgramAction: (state, { payload }: PayloadAction<{
      programId: BlueprintNodeId,
    }>) => {
      state.activeProgramId = payload.programId
      state.selectedNodeId = undefined
      state.linkControlId = undefined
    },

    /**
     * Move a level up, changing the active program to its parent program.
     */
    leaveProgramAction: (state, { payload }: PayloadAction<{}>) => {
      if (state.activeProgramId && state.activeProgramId !== state.rootProgramId) {
        state.activeProgramId = getNode(state, state.activeProgramId).parentId
      } else {
        state.activeProgramId = undefined
      }
      state.selectedNodeId = undefined
      state.linkControlId = undefined
    },

    /**
     * Add an empty control node to the given program.
     */
    addEmptyControlAction: (state, { payload }: PayloadAction<{
      programId: BlueprintNodeId,
    }>) => {
      addProgramControlNode(state, payload.programId)
    },

    /**
     * Mark a control as to be linked. If two controls are marked, link them.
     */
    linkControlAction: (state, { payload }: PayloadAction<{
      controlId: BlueprintNodeId,
    }>) => {
      const controlId = payload.controlId
      if (state.linkControlId === undefined) {
        state.linkControlId = controlId
      } else if (state.linkControlId === controlId) {
        state.linkControlId = undefined
      } else {
        linkControls(state, state.linkControlId, controlId)
        state.linkControlId = undefined
      }
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
     * Select a node.
     */
    selectNodeAction: (state, { payload }: PayloadAction<{
      nodeId: BlueprintNodeId,
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
        removeNode(state, nodeId)
      }
    }
  }
})

export const {
  addOperationAction,
  addEmptyProgramAction,
  enterProgramAction,
  leaveProgramAction,
  addEmptyControlAction,
  changeControlAction,
  linkControlAction,
  applyOperationTaskResultAction,
  selectNodeAction,
  removeNodeAction,
} = blueprintSlice.actions

export default blueprintSlice.reducer
