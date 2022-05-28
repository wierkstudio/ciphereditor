
import './select.scss'
import IconView from 'views/icon/icon'
import { ChangeEventHandler } from 'react'
import { renderClassName, ViewModifiers } from 'utils/dom'

export interface SelectViewOptionElement {
  type: 'option'
  value: string | number
  label: string
}

export interface SelectViewGroupElement {
  type: 'group'
  label: string
  elements: Array<SelectViewOptionElement | SelectViewDividerElement>
}

export interface SelectViewDividerElement {
  type: 'divider'
}

export type SelectViewElement =
  SelectViewOptionElement | SelectViewGroupElement | SelectViewDividerElement

export default function SelectView (props: {
  elements: SelectViewElement[]
  value?: string|number
  valueLabel?: string
  onChange?: ChangeEventHandler<HTMLSelectElement>
  modifiers?: ViewModifiers
}): JSX.Element {
  const selectedElement =
    props.elements.find(element =>
      element.type === 'option' &&
      element.value === props.value
    ) as SelectViewOptionElement | undefined
  return (
    <div
      className={renderClassName('select', props.modifiers)}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <select
        className='select__control'
        value={props.value !== undefined ? props.value : ''}
        onChange={props.onChange}
      >
        {(props.value === undefined) && (
          <option value='' disabled>{props.valueLabel}</option>
        )}
        {props.elements.map(renderElement)}
      </select>
      <div className='select__value'>
        {props.valueLabel ?? selectedElement?.label ?? 'Select'}
      </div>
      <div className='select__chevron'>
        <IconView icon='doubleChevron' />
      </div>
    </div>
  )
}

function renderElement (element: SelectViewElement, index: number): JSX.Element {
  switch (element.type) {
    case 'option':
      return (
        <option key={index} value={element.value}>
          {element.label}
        </option>
      )
    case 'divider':
      return (
        <option key={index} disabled>
          -
        </option>
      )
    case 'group':
      return (
        <optgroup key={index} label={element.label}>
          {element.elements.map(renderElement)}
        </optgroup>
      )
  }
}
