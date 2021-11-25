
import { BlueprintState } from '../types/blueprint'
import { ControlChange } from '../types/control'
import { Operation } from '../types/operation'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { addEmptyProgramNode, defaultProgramNode } from './blueprint/program'
import { addOperationNode } from './blueprint/operation'
import { findControlNode } from './blueprint/control'
import { resolveImplicitTypedValue } from './blueprint/value'

type AddOperationPayload = {
  /**
   * Program node id the operation should be added to
   */
  programId: number

  /**
   * Operation entity to be instantiated
   */
  operation: Operation
}

type AddEmptyProgramPayload = {
  /**
   * Program id a new program should be added to
   * If empty, a new root program will be added
   */
  programId?: number
}

type ChangeControlPayload = {
  /**
   * Control id the change should be applied to
   */
  controlId: number

  /**
   * Control change to be applied
   */
  change: ControlChange
}

const defaultBlueprintState: BlueprintState = {
  title: 'New Blueprint',
  rootProgramId: 1,
  nodes: {
    1: defaultProgramNode,
  },
  nodeIdCounter: 1,
}

export const blueprintSlice = createSlice({
  name: 'blueprint',
  initialState: defaultBlueprintState,
  reducers: {
    /**
     * Instantiate a operation and add it to the target program
     */
    addOperation: (state, action: PayloadAction<AddOperationPayload>) => {
      addOperationNode(state, action.payload.programId, action.payload.operation)
    },

    /**
     * Add an empty program to the target program
     */
    addEmptyProgram: (state, action: PayloadAction<AddEmptyProgramPayload>) => {
      addEmptyProgramNode(state, action.payload.programId)
    },

    /**
     * Apply a control change and propagate it through attached variables
     */
    changeControl: (state, action: PayloadAction<ChangeControlPayload>) => {
      const control = findControlNode(state, action.payload.controlId)
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
  }
})

export const {
  addOperation,
  addEmptyProgram,
  changeControl,
} = blueprintSlice.actions

export default blueprintSlice.reducer
