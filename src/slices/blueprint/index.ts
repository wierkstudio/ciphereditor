
import undoable, { excludeAction } from 'redux-undo'
import {
  addProgramControlNode,
  addVariableFromControl,
  changeControl,
  changeControlValueToChoice,
  changeControlValueToType
} from './reducers/control'
import { BlueprintNodeId, BlueprintState, BlueprintNodeType } from './types/blueprint'
import { ControlChange, ControlChangeSource, ControlViewState } from './types/control'
import { Operation, OperationRequest, OperationResult, operationSchema, OperationState } from './types/operation'
import { PayloadAction, createAction, createSlice } from '@reduxjs/toolkit'
import { addEmptyProgramNode, defaultProgramNode } from './reducers/program'
import { addOperationNode, retryOperation, setOperationState } from './reducers/operation'
import { attachControls, attachControlToVariable, detachControlFromVariable } from './reducers/variable'
import { getControlNode, getNodeNamedControls } from './selectors/control'
import { getNode, hasNode } from './selectors/blueprint'
import { getOperationNode } from './selectors/operation'
import { removeNode, selectNode } from './reducers/blueprint'

const defaultBlueprintState: BlueprintState = {
  title: 'New Blueprint',
  nodes: { 1: defaultProgramNode },
  lastInsertNodeId: 1,
  selectedNodeId: undefined,
  rootProgramId: 1,
  activeProgramId: 1,
  busyOperationIds: []
}

export const blueprintSlice = createSlice({
  name: 'blueprint',
  initialState: defaultBlueprintState,
  reducers: {
    /**
     * Instantiate a operation and add it to the target program
     */
    addOperationAction: (state, { payload }: PayloadAction<{
      programId: BlueprintNodeId
      operation: Operation | any
      x: number
      y: number
    }>) => {
      const { programId, x, y } = payload
      const operationEntity = operationSchema.parse(payload.operation)
      const operation = addOperationNode(state, programId, operationEntity, x, y)
      state.selectedNodeId = operation.id
    },

    /**
     * Add an empty program to the target program
     * If no program is given, it will be added to the active program
     */
    addEmptyProgramAction: (state, { payload }: PayloadAction<{
      programId?: BlueprintNodeId
      x: number
      y: number
    }>) => {
      // TODO: Handle no active program
      const { programId, x, y } = payload
      const program = addEmptyProgramNode(state, programId ?? state.activeProgramId, x, y)
      state.selectedNodeId = program.id
    },

    /**
     * Add an empty control node to the given program.
     */
    addEmptyControlAction: (state, { payload }: PayloadAction<{
      programId: BlueprintNodeId
      x: number
      y: number
    }>) => {
      const control = addProgramControlNode(state, payload.programId, payload.x, payload.y)
      state.selectedNodeId = control.id
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
      if (state.activeProgramId !== undefined && state.activeProgramId !== state.rootProgramId) {
        state.activeProgramId = getNode(state, state.activeProgramId).parentId
        state.selectedNodeId = undefined
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

    toggleControlViewState: (state, { payload }: PayloadAction<{
      controlId: BlueprintNodeId
    }>) => {
      const control = getControlNode(state, payload.controlId)
      if (control.viewState === ControlViewState.Collapsed) {
        control.viewState = ControlViewState.Expanded
      } else if (control.viewState === ControlViewState.Expanded) {
        control.viewState = ControlViewState.Collapsed
      }
    },

    addVariableFromControlAction: (state, { payload }: PayloadAction<{
      controlId: BlueprintNodeId
      programId: BlueprintNodeId
    }>) => {
      addVariableFromControl(state, payload.controlId, payload.programId)
    },

    attachControlsAction: (state, { payload }: PayloadAction<{
      sourceControlId: BlueprintNodeId
      targetControlId: BlueprintNodeId
      contextProgramId: BlueprintNodeId
    }>) => {
      attachControls(state, payload.sourceControlId, payload.targetControlId, payload.contextProgramId)
    },

    /**
     * Apply control changes to the given parent node.
     */
    changeControlAction: (state, { payload }: PayloadAction<{
      controlId: BlueprintNodeId
      change: ControlChange
    }>) => {
      changeControl(state, payload.controlId, payload.change, ControlChangeSource.UserInput)
    },

    /**
     * Apply an operation result to the blueprint.
     */
    applyOperationResultAction: (state, { payload }: PayloadAction<{
      operationId: BlueprintNodeId
      requestVersion: number
      request: OperationRequest
      result: OperationResult
    }>) => {
      const { operationId, requestVersion, result } = payload
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
      const success = result.issues?.find(issue => issue.type === 'error') === undefined
      if (success) {
        const namedControls = getNodeNamedControls(state, operationId)
        result.changes?.forEach(change => changeControl(
          state, namedControls[change.name].id, change, ControlChangeSource.Parent))
        setOperationState(state, operation.id, OperationState.Ready, result.issues)
      } else {
        setOperationState(state, operation.id, OperationState.Error, result.issues)
      }
    },

    retryOperationAction: (state, { payload }: PayloadAction<{
      nodeId: BlueprintNodeId
    }>) => {
      retryOperation(state, payload.nodeId)
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
        if (node.type === BlueprintNodeType.Control && parent.type === BlueprintNodeType.Operation) {
          return
        }

        removeNode(state, nodeId)
      }
    },

    moveNodeAction: (state, { payload }: PayloadAction<{
      nodeId: BlueprintNodeId
      x: number
      y: number
    }>) => {
      const node = getNode(state, payload.nodeId)
      node.x = payload.x
      node.y = payload.y
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

      const node = getNode(state, nodeId)
      node.width = width
      node.height = height

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
  attachControlsAction,
  applyOperationResultAction,
  retryOperationAction,
  selectNodeAction,
  removeNodeAction,
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
    toggleControlViewState.type,
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
