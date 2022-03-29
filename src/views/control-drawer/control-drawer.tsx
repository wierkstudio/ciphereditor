
import './control-drawer.scss'
import React, { BaseSyntheticEvent, MouseEvent, useCallback } from 'react'
import SelectView, { SelectViewElement } from 'views/select/select'
import ValueView from 'views/value/value'
import useAppDispatch from 'hooks/useAppDispatch'
import {
  changeControlAction,
  changeControlValueToChoiceAction,
  changeControlValueToTypeAction
} from 'slices/blueprint'
import { ControlNode } from 'slices/blueprint/types/control'
import { TypedValue } from 'slices/blueprint/types/value'
import { labelType, stringifyValue } from 'slices/blueprint/reducers/value'
import { BlueprintNodeId } from 'slices/blueprint/types/blueprint'
import ButtonView from 'views/button/button'

export default function ControlDrawerView (props: {
  control: ControlNode
  contextProgramId: BlueprintNodeId
}): JSX.Element {
  const dispatch = useAppDispatch()
  const { control } = props
  const controlId = control.id
  const value = control.value

  const onValueChange = useCallback((value: TypedValue, event?: BaseSyntheticEvent) => {
    dispatch(changeControlAction({ controlId, change: { value } }))
  }, [dispatch, controlId])

  const onValueCopy = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    // TODO: Make it visible to the user that they just copied the value
    void navigator.clipboard.writeText(stringifyValue(value))
  }, [value])

  const onSelectChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    const type = value[0]
    const choiceIndex = parseInt(value.substring(1))
    switch (type) {
      case 'c':
        dispatch(changeControlValueToChoiceAction({
          controlId,
          choiceIndex
        }))
        break
      case 't':
        dispatch(changeControlValueToTypeAction({
          controlId,
          valueType: control.types[choiceIndex]
        }))
        break
    }
  }, [dispatch, controlId, control.types])

  const selectElements: SelectViewElement[] = []
  let selectValue
  let selectLabel

  if (control.choices.length > 0) {
    selectElements.push({
      type: 'group',
      label: 'Known value',
      elements: control.choices.map((choice, index) => ({
        type: 'option',
        value: `c${index}`,
        label: choice.label
      }))
    })
    if (control.selectedChoiceIndex !== undefined) {
      selectValue = `c${control.selectedChoiceIndex}`
      selectLabel = control.choices[control.selectedChoiceIndex].label
    }
  }

  if (!control.enforceChoices || control.choices.length === 0) {
    selectElements.push({
      type: 'group',
      label: 'Custom value',
      elements: control.types.map((type, index) => ({
        type: 'option',
        value: `t${index}`,
        label: labelType(type)
      }))
    })
    if (selectValue === undefined) {
      const typeIndex = control.types.findIndex(t => control.value.type === t)
      if (typeIndex !== -1) {
        selectValue = `t${typeIndex}`
        selectLabel = labelType(control.types[typeIndex])
      }
    }
  }

  const showValue =
    control.selectedChoiceIndex === undefined ||
    control.choices.length === 0

  return (
    <div
      className='control-drawer'
      onMouseDown={(event) => event.stopPropagation()}
    >
      {showValue && (
        <div className='control-drawer__value'>
          <ValueView
            value={control.value}
            readOnly={!control.writable}
            onChange={onValueChange}
            modifiers={['drawer']}
          />
        </div>
      )}
      <div className='control-drawer__footer'>
        <div className='control-drawer__select'>
          <SelectView
            elements={selectElements}
            value={selectValue}
            valueLabel={selectLabel}
            onChange={onSelectChange}
          />
        </div>
        <div className='control-drawer__copy'>
          <ButtonView icon='copy' onClick={onValueCopy} />
        </div>
      </div>
    </div>
  )
}
