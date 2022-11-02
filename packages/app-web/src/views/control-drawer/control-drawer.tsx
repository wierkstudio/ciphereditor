
import './control-drawer.scss'
import {
  changeControlAction,
  changeControlValueToChoiceAction,
  changeControlValueToTypeAction
} from '../../slices/blueprint'
import ButtonView from '../../views/button/button'
import IssueListView from '../issue-list/issue-list'
import React, { BaseSyntheticEvent, MouseEvent, useCallback } from 'react'
import SelectView, { SelectViewElement } from '../../views/select/select'
import ValueView from '../../views/value/value'
import useAppDispatch from '../../hooks/useAppDispatch'
import useBlueprintSelector from '../../hooks/useBlueprintSelector'
import useTranslation from '../../hooks/useTranslation'
import { ControlNodeState } from '../../slices/blueprint/types/control'
import { extractValue, identifySerializedValueType, labelType, previewSerializedValue, SerializedValue, stringifyValue } from '@ciphereditor/library'
import { getOperationIssues } from '../../slices/blueprint/selectors/operation'
import { tryToWriteTextToClipboard } from '../../lib/utils/dom'

export default function ControlDrawerView (props: {
  control: ControlNodeState
  outward?: boolean
}): JSX.Element {
  const dispatch = useAppDispatch()
  const [t] = useTranslation()
  const { control } = props
  const controlId = control.id
  const value = control.value

  const issues = useBlueprintSelector(state => getOperationIssues(state, controlId))

  const onValueChange = useCallback((value: SerializedValue, event?: BaseSyntheticEvent) => {
    dispatch(changeControlAction({
      controlId,
      change: { sourceNodeId: controlId, value }
    }))
  }, [dispatch, controlId])

  const onValueCopy = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    // TODO: Make it visible to the user that they just copied the value
    tryToWriteTextToClipboard(stringifyValue(extractValue(value)))
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
  let optionsCount = 0

  if (control.options.length > 0) {
    selectElements.push({
      type: 'group',
      label: t('Known value'),
      elements: control.options.map((option, index) => ({
        type: 'option',
        value: `c${index}`,
        label: option.label ?? previewSerializedValue(option.value)
      }))
    })
    optionsCount += control.options.length
    if (control.selectedOptionIndex !== undefined) {
      selectValue = `c${control.selectedOptionIndex}`
      selectLabel = control.options[control.selectedOptionIndex].label
    }
  }

  // TODO: Translate label type
  if (!control.enforceOptions || control.options.length === 0) {
    selectElements.push({
      type: 'group',
      label: t('Custom value'),
      elements: control.types.map((type, index) => ({
        type: 'option',
        value: `t${index}`,
        label: labelType(type)
      }))
    })
    optionsCount += control.types.length
    if (selectValue === undefined) {
      const typeIndex = control.types.findIndex(t => identifySerializedValueType(control.value) === t)
      if (typeIndex !== -1) {
        selectValue = `t${typeIndex}`
        selectLabel = labelType(control.types[typeIndex])
      }
    }
  }

  const showValue =
    control.selectedOptionIndex === undefined ||
    control.options.length === 0

  return (
    <div
      className='control-drawer'
      onPointerDown={(event) => event.stopPropagation()}
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
      {issues.length > 0 && (
        <div className='control-drawer__issues'>
          <IssueListView issues={issues} />
        </div>
      )}
      <div className='control-drawer__footer'>
        <div className='control-drawer__footer-start'>
          {(control.writable && optionsCount > 1)
            ? (
              <SelectView
                elements={selectElements}
                value={selectValue}
                valueLabel={selectLabel}
                onChange={onSelectChange}
                modifiers={showValue ? ['meta'] : []}
              />
              )
            : (
              <ButtonView disabled modifiers={['meta']}>
                {/* TODO: Needs translation */}
                {labelType(identifySerializedValueType(control.value)) +
                  (!control.writable ? ' (read only)' : '')}
              </ButtonView>
              )}
        </div>
        <div className='control-drawer__footer-end'>
          <ButtonView
            title={t('Copy control value')}
            icon='copy'
            onClick={onValueCopy}
            modifiers={['meta']}
          />
        </div>
      </div>
    </div>
  )
}
