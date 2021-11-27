
import { BlueprintNodeId, BlueprintState } from 'types/blueprint'
import { ControlChange } from 'types/control'
import { Operation } from 'types/operation'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { addEmptyProgramNode, defaultProgramNode } from './reducers/program'
import { addOperationNode } from './reducers/operation'
import { resolveImplicitTypedValue } from './reducers/value'
import { getNode } from './selectors/blueprint'
import { getControlNode } from './selectors/control'
import { addProgramControlNode } from './reducers/control'
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

type ChangeControlPayload = {
  /**
   * Control id the change should be applied to
   */
  controlId: BlueprintNodeId

  /**
   * Control change to be applied
   */
  change: ControlChange
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

    /**
     * Apply a control change and propagate it through attached variables
     */
    changeControlAction: (state, action: PayloadAction<ChangeControlPayload>) => {
      const control = getControlNode(state, action.payload.controlId)
      const change = action.payload.change

      if (change.value) {
        // TODO: Propagate value
        control.value = resolveImplicitTypedValue(change.value)
      }

      control.label = change.label || control.label
      control.enum = change.enum || control.enum

      // TODO: Propagate enabled state to attached program controls
      control.enabled = change.enabled || control.enabled
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
  changeControlAction,
  selectNodeAction,
  removeNodeAction,
} = blueprintSlice.actions

export default blueprintSlice.reducer
