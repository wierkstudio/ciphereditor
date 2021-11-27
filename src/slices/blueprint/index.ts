
import { BlueprintNodeId, BlueprintNodeType, BlueprintState } from 'types/blueprint'
import { ControlChange, ControlChangeSource } from 'types/control'
import { Operation, OperationNode, OperationState } from 'types/operation'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { addEmptyProgramNode, defaultProgramNode } from './reducers/program'
import { addOperationNode, changeOperationControls, setOperationState } from './reducers/operation'
import { addProgramControlNode } from './reducers/control'
import { getNode, hasNode } from './selectors/blueprint'
import { getOperationNode } from './selectors/operation'
import { removeNode } from './reducers/blueprint'

type AddOperationPayload = {
  /**
   * Program node id the operation should be added to
   */
  programId: BlueprintNodeId

  /**
   * Operation entity to be instantiated
   */
  operation: Operation
}

type AddEmptyProgramPayload = {
  /**
   * Program id a new program should be added to
   * If empty, the program will be added to the active program
   */
  programId?: BlueprintNodeId
}

type EnterProgramPayload = {
  /**
   * Id of the program node that should become active
   */
  programId: BlueprintNodeId
}

type LeaveProgramPayload = {

}

type AddEmptyControlPayload = {
  /**
   * Program node id the control should be added to
   */
  programId: BlueprintNodeId
}

type ChangeControlsPayload = {
  /**
   * Target node control changed should be applied to
   */
  nodeId: BlueprintNodeId

  /**
   * Control changes to be applied
   */
  changes: ControlChange[]
}

type CompleteOperationTaskPayload = {
  /**
   * Operation id of the completed task
   */
  operationId: BlueprintNodeId

  /**
   * Task version
   */
  taskVersion: number

  /**
   * Resulting control changes
   */
  controlChanges: ControlChange[]

  /**
   * Error object, if task failed
   */
  error?: string
}

type ChangeSelectedNodePayload = {
  /**
   * Node id to be selected
   */
  nodeId: BlueprintNodeId
}

type RemoveNodePayload = {
  /**
   * Node id to be removed
   */
  nodeId: BlueprintNodeId
}

const defaultBlueprintState: BlueprintState = {
  title: 'New Blueprint',
  nodes: { 1: defaultProgramNode },
  selectedNodeId: undefined,
  rootProgramId: 1,
  activeProgramId: 1,
  busyOperationIds: [],
  nodeIdCounter: 1,
}

export const blueprintSlice = createSlice({
  name: 'blueprint',
  initialState: defaultBlueprintState,
  reducers: {
    /**
     * Instantiate a operation and add it to the target program
     */
    addOperationAction: (state, action: PayloadAction<AddOperationPayload>) => {
      addOperationNode(state, action.payload.programId, action.payload.operation)
    },

    /**
     * Add an empty program to the target program
     */
    addEmptyProgramAction: (state, action: PayloadAction<AddEmptyProgramPayload>) => {
      // TODO: Handle no active program
      addEmptyProgramNode(state, action.payload.programId ?? state.activeProgramId)
    },

    enterProgramAction: (state, action: PayloadAction<EnterProgramPayload>) => {
      state.activeProgramId = action.payload.programId
      state.selectedNodeId = undefined
    },

    leaveProgramAction: (state, action: PayloadAction<LeaveProgramPayload>) => {
      if (state.activeProgramId && state.activeProgramId !== state.rootProgramId) {
        state.activeProgramId = getNode(state, state.activeProgramId).parentId
      } else {
        state.activeProgramId = undefined
      }
      state.selectedNodeId = undefined
    },

    addEmptyControlAction: (state, action: PayloadAction<AddEmptyControlPayload>) => {
      addProgramControlNode(state, action.payload.programId)
    },

    changeControlsAction: (state, action: PayloadAction<ChangeControlsPayload>) => {
      const targetNode = getNode(state, action.payload.nodeId)
      // TODO: Handle changes to program controls
      if (targetNode.type === BlueprintNodeType.Operation) {
        const operation = targetNode as OperationNode
        changeOperationControls(state, operation, action.payload.changes, ControlChangeSource.UserInput)
      }
    },

    completeOperationTaskAction: (state, action: PayloadAction<CompleteOperationTaskPayload>) => {
      const { operationId, taskVersion, controlChanges, error } = action.payload
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
        changeOperationControls(state, operation, controlChanges, ControlChangeSource.Parent)
      } else {
        console.error('Operation task failed', error)
        setOperationState(state, operation, OperationState.Failed)
      }
    },

    selectNodeAction: (state, action: PayloadAction<ChangeSelectedNodePayload>) => {
      state.selectedNodeId = action.payload.nodeId
    },

    removeNodeAction: (state, action: PayloadAction<RemoveNodePayload>) => {
      removeNode(state, action.payload.nodeId)
    }
  }
})

export const {
  addOperationAction,
  addEmptyProgramAction,
  enterProgramAction,
  leaveProgramAction,
  addEmptyControlAction,
  changeControlsAction,
  completeOperationTaskAction,
  selectNodeAction,
  removeNodeAction,
} = blueprintSlice.actions

export default blueprintSlice.reducer
