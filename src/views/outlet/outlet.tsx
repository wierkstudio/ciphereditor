
import './outlet.scss'
import IconView from 'views/icon/icon'
import OutletSelectView from 'views/outlet-select/outlet-select'
import useBlueprintSelector from 'hooks/useBlueprintSelector'
import useClassName from 'hooks/useClassName'
import { BlueprintNodeId } from 'slices/blueprint/types/blueprint'
import { ControlNode } from 'slices/blueprint/types/control'
import { MouseEventHandler } from 'react'
import { getControlVariable, getVariableControl } from 'slices/blueprint/selectors/variable'

export default function OutletView (props: {
  control: ControlNode
  contextProgramId: BlueprintNodeId
  expanded: boolean
  onIndicatorClick?: MouseEventHandler<HTMLButtonElement>
  indicatorRef?: (element: HTMLButtonElement) => void
}): JSX.Element {
  const { control, contextProgramId, indicatorRef } = props

  const attachedVariable = useBlueprintSelector(state =>
    getControlVariable(state, props.control.id, contextProgramId))
  const attachedVariableSourceControl = useBlueprintSelector(state =>
    attachedVariable !== undefined ? getVariableControl(state, attachedVariable.id) : undefined)

  const isUnused = attachedVariable === undefined
  const isPushing = attachedVariableSourceControl !== undefined && attachedVariableSourceControl.id === control.id
  const variant = isUnused ? 'unused' : (isPushing ? 'push' : 'pull')

  const modifiers = [variant].concat(props.expanded ? ['expanded'] : '')

  return (
    <div
      className={useClassName('outlet', modifiers)}
    >
      {props.expanded && (
        <div className='outlet__select'>
          <OutletSelectView control={control} contextProgramId={contextProgramId} />
        </div>
      )}
      <button
        className='outlet__indicator'
        tabIndex={-1}
        onPointerDown={event => event.stopPropagation()}
        onClick={props.onIndicatorClick}
        ref={indicatorRef}
      >
        {(variant === 'unused') && (
          <IconView icon='outletUnused' />
        )}
        {(variant === 'push') && (
          <IconView icon='outletPush' />
        )}
        {(variant === 'pull') && (
          <IconView icon='outletPull' />
        )}
      </button>
    </div>
  )
}
