
import SelectView, { SelectViewElement, SelectViewOptionElement } from 'views/select/select'
import useAppDispatch from 'hooks/useAppDispatch'
import useBlueprintSelector from 'hooks/useBlueprintSelector'
import {
  addVariableFromControlAction,
  attachControlToVariableAction,
  detachControlFromVariableAction
} from 'slices/blueprint'
import { ControlNode } from 'slices/blueprint/types/control'
import { getControlVariable, getVariableControl } from 'slices/blueprint/selectors/variable'
import { getControlVariableOptions } from 'slices/blueprint/selectors/control'
import { useCallback } from 'react'
import { BlueprintNodeId } from 'slices/blueprint/types/blueprint'

export default function OutletSelectView (props: {
  control: ControlNode
  contextProgramId: BlueprintNodeId
}): JSX.Element {
  const dispatch = useAppDispatch()
  const { control, contextProgramId } = props
  const controlId = control.id

  const { pushOptions, pullOptions } = useBlueprintSelector(state =>
    getControlVariableOptions(state, props.control.id, contextProgramId))

  const attachedVariable = useBlueprintSelector(state =>
    getControlVariable(state, props.control.id, contextProgramId))
  const attachedVariableSourceControl = useBlueprintSelector(state =>
    attachedVariable !== undefined ? getVariableControl(state, attachedVariable.id) : undefined)
  const attachedVariableId = attachedVariable?.id

  const onSelectChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    const type = value[0]
    const choiceIndex = parseInt(value.substring(1))
    let variable
    switch (type) {
      case 'u':
        if (attachedVariableId !== undefined) {
          // Detach variable
          dispatch(detachControlFromVariableAction({
            controlId,
            variableId: attachedVariableId
          }))
        }
        break
      case 's':
        // Push to a variable
        variable = pushOptions[choiceIndex]
        if (variable !== undefined) {
          dispatch(attachControlToVariableAction({
            controlId,
            variableId: variable.id,
            push: true
          }))
        }
        break
      case 'n':
        // Push to a new variable
        dispatch(addVariableFromControlAction({
          controlId,
          programId: contextProgramId
        }))
        break
      case 'l':
        // Pull from a variable
        variable = pullOptions[choiceIndex]
        if (variable !== undefined) {
          dispatch(attachControlToVariableAction({
            controlId,
            variableId: variable.id,
            push: false
          }))
        }
        break
    }
  }, [dispatch, pullOptions, pushOptions, controlId, attachedVariableId, contextProgramId])

  const isUnused = attachedVariable === undefined
  const isPushing = attachedVariableSourceControl !== undefined && attachedVariableSourceControl.id === control.id

  let selectLabel = 'Use'
  if (!isUnused) {
    selectLabel = isPushing ? 'Push' : 'Pull'
  }

  let selectValue = 'u'
  const selectElements: SelectViewElement[] = [{
    type: 'option',
    label: 'Unused',
    value: 'u'
  }]

  selectElements.push({
    type: 'group',
    label: 'Push to',
    elements:
      pushOptions.map((variable, index): SelectViewOptionElement => ({
        type: 'option',
        value: `s${index}`,
        label: `Variable ${variable.id}`
      })).concat([{
        type: 'option',
        value: 'n',
        label: 'New variable'
      }])
  })

  if (attachedVariable !== undefined && isPushing) {
    const variableIndex = pushOptions.findIndex(v => v.id === attachedVariable.id)
    if (variableIndex !== -1) {
      selectValue = `s${variableIndex}`
    }
  }

  if (pullOptions.length > 0) {
    selectElements.push({
      type: 'group',
      label: 'Pull from',
      elements: pullOptions.map((variable, index) => ({
        type: 'option',
        value: `l${index}`,
        label: `Variable ${variable.id}`
      }))
    })
    if (attachedVariable !== undefined && !isPushing) {
      const variableIndex = pullOptions.findIndex(v => v.id === attachedVariable.id)
      if (variableIndex !== -1) {
        selectValue = `l${variableIndex}`
      }
    }
  }

  return (
    <SelectView
      elements={selectElements}
      value={selectValue}
      valueLabel={selectLabel}
      onChange={onSelectChange}
      modifiers={['height-6', 'chevron-first', 'transparent'].concat(isUnused ? ['meta'] : ['primary'])}
    />
  )
}
