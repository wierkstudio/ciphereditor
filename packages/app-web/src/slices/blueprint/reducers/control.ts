
import {
  Control,
  ControlNode,
  availableValueTypes,
  castSerializedValue,
  compareSerializedValues,
  createEmptyValue,
  identifySerializedValueType,
  serializeValue,
  SerializedValue
} from '@ciphereditor/library'
import { BlueprintNodeId, BlueprintState } from '../types/blueprint'
import { ControlNodeState, ControlNodeChange } from '../types/control'
import { OperationNodeState } from '../types/operation'
import { addChildNode, nextNodeId } from './blueprint'
import { addVariable, propagateChange } from './variable'
import { arrayUniqueUnshift } from '../../../lib/utils/array'
import { capitalCase } from 'change-case'
import { deriveUniqueName } from '../../../lib/utils/string'
import { getControlNode } from '../selectors/control'
import { getNextNodeFrame, getNode, getNodeChildren } from '../selectors/blueprint'
import { setOperationState } from './operation'

/**
 * Default control node object
 */
export const defaultControlNode: ControlNodeState = {
  id: -1,
  type: 'control',
  parentId: -1,
  childIds: [],
  name: '',
  label: 'Control',
  description: undefined,
  types: availableValueTypes,
  value: serializeValue(createEmptyValue()),
  options: [],
  enforceOptions: true,
  visibility: 'collapsed',
  writable: true,
  maskPreview: false,
  order: 0
}

/**
 * Add the given control to the state
 * @param state Blueprint state slice
 * @param controlNode Control to be added
 * @param programId Id of the parent program the control should be added to
 * @param refIdMap Object mapping serialized ids to instanciated ids found
 * while adding nodes. Tracking these ids is necessary to resolve variable
 * attachments in the parent program.
 */
export const addControlNode = (
  state: BlueprintState,
  controlNode: ControlNode,
  programId: BlueprintNodeId,
  refIdMap?: Record<string, BlueprintNodeId>
): ControlNodeState => {
  const id = nextNodeId(state)

  // Choose label and optional unique alias
  const controls = getNodeChildren(state, programId, 'control') as ControlNodeState[]
  const usedLabels = controls.map(control => control.alias ?? control.label)
  const label = controlNode.label ?? defaultControlNode.label
  const uniqueLabel = deriveUniqueName(label, usedLabels)
  const alias = uniqueLabel !== label ? uniqueLabel : undefined

  const control: ControlNodeState = {
    ...defaultControlNode,
    parentId: programId,
    id,
    name: `control${id}`,
    label,
    alias,
    frame: getNextNodeFrame(state, programId, controlNode.frame),
    value: controlNode.value,
    visibility: controlNode.visibility ?? defaultControlNode.visibility
  }

  if (refIdMap !== undefined && controlNode.id !== undefined) {
    refIdMap[controlNode.id] = id
  }

  return addChildNode(state, control)
}

/**
 * Add a control to the given operation node id.
 * @param state Blueprint state
 * @param operationId Operation node id
 * @param control Control to be added
 * @param initialValue Initial value, if deviating from the default value
 * @returns New control node
 */
export const addOperationControlNode = (
  state: BlueprintState,
  operationId: BlueprintNodeId,
  control: Control,
  initialValue: SerializedValue | undefined
): ControlNodeState => {
  const value = initialValue ?? control.value
  const options = control.options ?? []
  const index = options.findIndex(o => compareSerializedValues(o.value, value))
  const selectedOptionIndex = index !== -1 ? index : undefined
  const controlNode: ControlNodeState = {
    ...defaultControlNode,
    ...control,
    id: nextNodeId(state),
    parentId: operationId,
    label: control.label ?? capitalCase(control.name),
    initialValue: value,
    value,
    selectedOptionIndex,
    options,
    visibility: control.visibility ?? defaultControlNode.visibility
  }
  return addChildNode(state, controlNode)
}

/**
 * Apply control changes originating from the user, an operation or a variable.
 */
export const changeControl = (
  state: BlueprintState,
  controlId: BlueprintNodeId,
  change: ControlNodeChange
): void => {
  const control = getControlNode(state, controlId)
  const oldValue = control.value
  const newValue = change.value !== undefined ? change.value : oldValue
  const equal: boolean = compareSerializedValues(oldValue, newValue)

  // Bail out early, if the value doesn't change
  if (equal) {
    return
  }

  // Update value
  control.value = newValue

  let operation: OperationNodeState
  const parent = getNode(state, control.parentId)
  const source = getNode(state, change.sourceNodeId)
  switch (parent.type) {
    case 'operation': {
      operation = parent as OperationNodeState
      if (source.type !== 'operation') {
        // Change is not originating from the operation, so mark it busy
        setOperationState(state, operation.id, 'busy')
        // Increment the request version every time a control changes
        if (operation.requestVersion !== undefined) {
          operation.requestVersion += 1
        }
        // Move the control id that was changed last to the head
        operation.priorityControlIds =
          arrayUniqueUnshift(operation.priorityControlIds, control.id)
      }
      if (source.type !== 'variable') {
        propagateChange(state, control.id, true)
      }
      break
    }
    case 'program': {
      if (source.type === 'variable') {
        if (source.id === control.attachedVariableId) {
          // Propagate change outside the program (if not root)
          if (state.rootProgramId !== parent.id) {
            propagateChange(state, control.id, true)
          }
        } else {
          // Propagate change inside the program
          propagateChange(state, control.id, false)
        }
      } else if (source.id === control.id) {
        propagateChange(state, control.id, true)
        propagateChange(state, control.id, false)
      }
      break
    }
  }
}

/**
 * Set a control value to the given choice index.
 */
export const changeControlValueToChoice = (
  state: BlueprintState,
  controlId: BlueprintNodeId,
  optionIndex: number
): void => {
  const control = getControlNode(state, controlId)
  const value = control.options[optionIndex].value
  changeControl(state, controlId, { sourceNodeId: control.id, value })
  control.selectedOptionIndex = optionIndex
}

/**
 * Change the type of a control value.
 */
export const changeControlValueToType = (
  state: BlueprintState,
  controlId: BlueprintNodeId,
  type: string
): void => {
  const control = getControlNode(state, controlId)
  control.selectedOptionIndex = undefined
  const valueType = identifySerializedValueType(control.value)
  if (valueType !== type) {
    let value = castSerializedValue(control.value, type)
    if (value === undefined) {
      value = serializeValue(createEmptyValue(type))
    }
    changeControl(state, controlId, { sourceNodeId: control.id, value })
  }
}

/**
 * Add a new variable from a control.
 */
export const addVariableFromControl = (
  state: BlueprintState,
  controlId: BlueprintNodeId,
  outward: boolean
): void => {
  // TODO: Detach currently attached variable
  addVariable(state, controlId, outward)
}
