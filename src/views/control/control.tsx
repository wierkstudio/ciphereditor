
import React, { ChangeEvent, useCallback } from 'react'
import ValueView from 'views/value/value'
import {
  addVariableFromControlAction,
  changeControlAction,
  changeControlValueToChoiceAction,
  changeControlValueToTypeAction,
  changeControlValueToVariableAction,
  selectNodeAction
} from 'slices/blueprint'
import { ControlNode } from 'types/control'
import { TypedValue } from 'types/value'
import { getSelectedNode } from 'slices/blueprint/selectors/blueprint'
import { useAppClassName, useAppDispatch, useAppSelector } from 'utils/hooks'
import { getControlVariable } from 'slices/blueprint/selectors/variable'
import { getControlVariableOptions, isControlInternVariable } from 'slices/blueprint/selectors/control'
import { ProgramNode } from 'types/program'
import { BlueprintNodeId } from 'types/blueprint'
import './control.scss'

export default function ControlView(props: {
  control: ControlNode
  program: ProgramNode
}) {
  const { control, program } = props

  const dispatch = useAppDispatch()
  const selectedNode = useAppSelector(state => getSelectedNode(state.blueprint))
  const controlId = control.id
  const programId = program.id
  const htmlId = `control-${controlId}`

  const { $options: $menuOptions, options: menuOptions, index: menuIndex } =
    useMenuOptions(control, program)

  const intern = useAppSelector(state => isControlInternVariable(state.blueprint, controlId, programId))
  const attachedVariable = useAppSelector(state => getControlVariable(state.blueprint, controlId, programId))
  const showValue = intern || (control.selectedChoiceIndex === undefined && attachedVariable === undefined)

  const onChange = useCallback((value: TypedValue, event: ChangeEvent) => {
    dispatch(changeControlAction({ controlId, change: { value } }))
  }, [dispatch, controlId])

  const onOptionChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const menuOption = menuOptions[parseInt(event.target.value)]
    if (menuOption === undefined) {
      return
    }

    const [type, payload] = menuOption
    switch (type) {
      case 'change_value_to_choice':
        const choiceIndex = payload as number
        dispatch(changeControlValueToChoiceAction({ controlId, choiceIndex }))
        break

      case 'change_value_to_type':
        const valueType = payload as string
        dispatch(changeControlValueToTypeAction({ controlId, valueType }))
        break

      case 'change_value_to_variable':
        const variableId = payload as BlueprintNodeId
        dispatch(changeControlValueToVariableAction({ controlId, variableId }))
        break

      case 'add_variable':
        dispatch(addVariableFromControlAction({ controlId, programId }))
        break
    }
  }, [dispatch, menuOptions, controlId, programId])

  const onFocus = useCallback(event => {
    event.stopPropagation()
    dispatch(selectNodeAction({ nodeId: controlId }))
  }, [dispatch, controlId])

  const modifiers = []
  if (selectedNode?.id === controlId) {
    modifiers.push('active')
  }

  return (
    <div className={useAppClassName('control', modifiers)} onFocus={onFocus}>
      <label className="control__label" htmlFor={htmlId}>{control.label}</label>
      <div className="control__menu">
        <select
          className="control__menu-select"
          id={htmlId}
          tabIndex={0}
          value={menuIndex.toString()}
          onChange={onOptionChange}
          onFocus={onFocus}
        >
          {$menuOptions}
        </select>
      </div>
      {showValue && (
        <div className="control__value">
          <ValueView
            id={htmlId}
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

/**
 * Get an array of menu options for the given control and program context.
 */
export const useMenuOptions = (control: ControlNode, program: ProgramNode) => {
  const $options = []
  const options: [string, any][] = []
  let selectedOptionIndex = -1
  let index = -1

  if (control.choices.length > 0) {
    $options.push(
      <optgroup key={index} label="Known value">
        {control.choices.map((choice, choiceIndex) => {
          index++
          options.push(['change_value_to_choice', choiceIndex])
          if (control.selectedChoiceIndex === choiceIndex) {
            selectedOptionIndex = index
          }
          return <option key={index} value={index}>{choice.label}</option>
        })}
      </optgroup>
    )
  }

  if (!control.enforceChoices || control.choices.length === 0) {
    $options.push(
      <optgroup key={index} label="Custom value">
        {control.types.map(type => {
          index++
          options.push(['change_value_to_type', type])
          if (selectedOptionIndex === -1 && control.value.type === type) {
            selectedOptionIndex = index
          }
          return <option key={index} value={index}>Use {type} value</option>
        })}
      </optgroup>
    )
  }

  const variables = useAppSelector(state => getControlVariableOptions(state.blueprint, control.id, program.id))
  const attachedVariable = useAppSelector(state => getControlVariable(state.blueprint, control.id, program.id))
  $options.push(
    <optgroup key={index} label="Variables">
      {variables.map(variable => {
        index++
        options.push(['change_value_to_variable', variable.id])
        if (variable.id === attachedVariable?.id) {
          selectedOptionIndex = index
        }
        return <option key={index} value={index}>Use variable {variable.id}</option>
      })}
      {(() => {
        index++
        options.push(['add_variable', undefined])
        return <option key={index} value={index}>Create new variable…</option>
      })()}
    </optgroup>
  )

  return { $options, options, index: selectedOptionIndex }
}
