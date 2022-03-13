
import './outlet.scss'
import IconView from 'views/icon/icon'
import OutletSelectView from 'views/outlet-select/outlet-select'
import useBlueprintSelector from 'hooks/useBlueprintSelector'
import useClassName from 'hooks/useClassName'
import { BlueprintNodeId } from 'slices/blueprint/types/blueprint'
import { ControlNode } from 'slices/blueprint/types/control'
import { MouseEventHandler } from 'react'
import { getControlVariable, getVariableControl } from 'slices/blueprint/selectors/variable'

export default function OutletView(props: {
  control: ControlNode
  contextProgramId: BlueprintNodeId
  expanded: boolean
  onIndicatorClick?: MouseEventHandler<HTMLButtonElement>
}) {
  const { control, contextProgramId } = props

  const attachedVariable = useBlueprintSelector(state =>
    getControlVariable(state, props.control.id, contextProgramId))
  const attachedVariableSourceControl = useBlueprintSelector(state =>
    attachedVariable ? getVariableControl(state, attachedVariable.id) : undefined)

  const isUnused = attachedVariable === undefined
  const isPushing = attachedVariableSourceControl && attachedVariableSourceControl.id === control.id
  const variant = isUnused ? 'unused' : (isPushing ? 'push' : 'pull')

  return (
    <div className={useClassName('outlet', [variant].concat(props.expanded ? ['expanded'] : ''))}>
      {props.expanded && (
        <div className="outlet__select">
          <OutletSelectView control={control} contextProgramId={contextProgramId} />
        </div>
      )}
      <button
        className="outlet__indicator"
        tabIndex={-1}
        onMouseDown={event => event.stopPropagation()}
        onClick={props.onIndicatorClick}
      >
        {(variant === 'unused') && (
          <IconView icon="outletUnused" />
        )}
        {(variant === 'push') && (
          <IconView icon="outletPush" />
        )}
        {(variant === 'pull') && (
          <IconView icon="outletPull" />
        )}
      </button>
    </div>
  )
}
