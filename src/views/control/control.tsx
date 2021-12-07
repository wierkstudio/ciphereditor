
import React, { ChangeEvent, useCallback, useState } from 'react'
import ValueView from 'views/value/value'
import { ControlNode } from 'types/control'
import { TypedValue } from 'types/value'
import { changeControlAction, selectNodeAction } from 'slices/blueprint'
import { compareValues } from 'slices/blueprint/reducers/value'
import { getSelectedNode } from 'slices/blueprint/selectors/blueprint'
import { useAppClassName, useAppDispatch, useAppSelector } from 'utils/hooks'
import './control.scss'

const otherRawValue = 'other'

export default function ControlView(props: {
  control: ControlNode
}) {
  const { control } = props

  const dispatch = useAppDispatch()
  const selectedNode = useAppSelector(state => getSelectedNode(state.blueprint))
  const controlId = `control-${control.id}`

  const hasOptions = control.options.length > 0
  const selectedOptionIndex = control.options
    .findIndex(option => compareValues(option.value, control.value))
  const [isOptionSelected, setOptionSelected] = useState(selectedOptionIndex !== -1)
  const selectedOption = isOptionSelected ? selectedOptionIndex : otherRawValue

  const onChange = useCallback((value: TypedValue, event: ChangeEvent) => {
    dispatch(changeControlAction({
      controlId: control.id,
      change: { value },
    }))
  }, [dispatch, control])

  const onOptionChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const rawValue = event.target.value
    if (rawValue !== otherRawValue) {
      const selectedOptionIndex = parseInt(rawValue)
      const selectedOption = control.options[selectedOptionIndex]
      onChange(selectedOption.value, event)
      setOptionSelected(true)
    } else {
      setOptionSelected(false)
    }
  }, [control, onChange, setOptionSelected])

  const onFocus = useCallback(event => {
    event.stopPropagation()
    dispatch(selectNodeAction({ nodeId: control.id }))
  }, [dispatch, control])

  const modifiers = []
  if (selectedNode?.id === control.id) {
    modifiers.push('active')
  }

  return (
    <div className={useAppClassName('control', modifiers)} onFocus={onFocus}>
      <label className="control__label" htmlFor={controlId}>{control.label}</label>
      {hasOptions && (
        <div className="control__options">
          <select
            className="control__options-select"
            id={controlId}
            tabIndex={0}
            value={selectedOption}
            onChange={onOptionChange}
            onFocus={onFocus}
          >
            {control.options.map((option, index) =>
              <option
                value={index}
                key={index}
                label={option.description}
              >{option.label}</option>
            )}
            {!control.enforceOptions && (
              <option value={otherRawValue}>Other</option>
            )}
          </select>
        </div>
      )}
      {!isOptionSelected && (
        <div className="control__value">
          <ValueView
            id={!hasOptions ? controlId : undefined}
            value={control.value}
            disabled={!control.writable}
            onChange={onChange}
            onFocus={onFocus}
          />
        </div>
      )}
    </div>
  )
}
