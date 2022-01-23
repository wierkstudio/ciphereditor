
import './outlet.scss'
import SelectView, { SelectViewElement, SelectViewGroupElement } from 'views/select/select'
import {
  addVariableFromControlAction,
  attachControlToVariableAction,
  detachControlFromVariableAction
} from 'slices/blueprint'
import { ControlNode } from 'types/control'
import { ProgramNode } from 'types/program'
import { ReactComponent as OutletPullIcon } from 'icons/outlet-pull.svg'
import { ReactComponent as OutletPushIcon } from 'icons/outlet-push.svg'
import { ReactComponent as OutletUnusedIcon } from 'icons/outlet-unused.svg'
import { getControlVariable, getVariableControl } from 'slices/blueprint/selectors/variable'
import { getControlVariableOptions } from 'slices/blueprint/selectors/control'
import { useAppDispatch, useBlueprintSelector } from 'utils/hooks'
import { MouseEventHandler, useCallback } from 'react'

export default function OutletView(props: {
  control: ControlNode
  program: ProgramNode
  expanded: boolean
  onIndicatorClick?: MouseEventHandler<HTMLButtonElement>
}) {
  const dispatch = useAppDispatch()
  const { control, program } = props
  const controlId = control.id
  const programId = program.id

  const { pushOptions, pullOptions } = useBlueprintSelector(state =>
    getControlVariableOptions(state, props.control.id, props.program.id))

  const attachedVariable = useBlueprintSelector(state =>
    getControlVariable(state, props.control.id, props.program.id))
  const attachedVariableSourceControl = useBlueprintSelector(state =>
    attachedVariable ? getVariableControl(state, attachedVariable.id) : undefined)
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
            variableId: attachedVariableId,
          }))
        }
        break
      case 's':
        // Push to a variable
        variable = pushOptions[choiceIndex]
        if (variable) {
          dispatch(attachControlToVariableAction({
            controlId,
            variableId: variable.id,
            push: true,
          }))
        }
        break
      case 'n':
        // Push to a new variable
        dispatch(addVariableFromControlAction({
          controlId,
          programId,
        }))
        break
      case 'l':
        // Pull from a variable
        variable = pullOptions[choiceIndex]
        if (variable) {
          dispatch(attachControlToVariableAction({
            controlId,
            variableId: variable.id,
            push: false,
          }))
        }
        break
    }
  }, [dispatch, pullOptions, pushOptions, controlId, attachedVariableId, programId])

  const isUnused = attachedVariable === undefined
  const isPushing = attachedVariableSourceControl && attachedVariableSourceControl.id === control.id

  let variant = 'unused'
  let selectLabel = 'Use'
  if (!isUnused) {
    variant = isPushing ? 'push' : 'pull'
    selectLabel = isPushing ? 'Push' : 'Pull'
  }

  let selectValue = 'u'
  const selectElements: SelectViewElement[] = [{
    type: 'option',
    label: 'Unused',
    value: 'u',
  }]

  selectElements.push({
    type: 'group',
    label: 'Push to',
    elements: pushOptions.map((variable, index) => ({
      type: 'option',
      value: `s${index}`,
      label: `Variable ${variable.id}`,
    })).concat([{
      type: 'option',
      value: 'n',
      label: 'New variable',
    }]),
  } as SelectViewGroupElement)

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
        label: `Variable ${variable.id}`,
      })),
    })
    if (attachedVariable !== undefined && !isPushing) {
      const variableIndex = pullOptions.findIndex(v => v.id === attachedVariable.id)
      if (variableIndex !== -1) {
        selectValue = `l${variableIndex}`
      }
    }
  }

  return (
    <div className={`outlet outlet--${variant}` + (props.expanded ? ' outlet--expanded' : '')}>
      {props.expanded && (
        <div className="outlet__select">
          <SelectView
            elements={selectElements}
            value={selectValue}
            valueLabel={selectLabel}
            onChange={onSelectChange}
            modifiers={['height-6', 'chevron-first'].concat(isUnused ? ['meta'] : ['primary'])}
          />
        </div>
      )}
      <button
        className="outlet__indicator"
        tabIndex={-1}
        onClick={props.onIndicatorClick}
      >
        {(variant === 'unused') && (
          <OutletUnusedIcon />
        )}
        {(variant === 'push') && (
          <OutletPushIcon />
        )}
        {(variant === 'pull') && (
          <OutletPullIcon />
        )}
      </button>
    </div>
  )
}
