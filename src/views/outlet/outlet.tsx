
import './outlet.scss'
import OutletSelectView from 'views/outlet-select/outlet-select'
import { BlueprintNodeId } from 'slices/blueprint/types/blueprint'
import { ControlNode } from 'slices/blueprint/types/control'
import { MouseEventHandler } from 'react'
import { ReactComponent as OutletPullIcon } from 'icons/outlet-pull.svg'
import { ReactComponent as OutletPushIcon } from 'icons/outlet-push.svg'
import { ReactComponent as OutletUnusedIcon } from 'icons/outlet-unused.svg'
import { getControlVariable, getVariableControl } from 'slices/blueprint/selectors/variable'
import { useBlueprintSelector } from 'hooks/useBlueprintSelector'
import { useClassNames } from 'hooks/useClassNames'

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
    <div className={useClassNames('outlet', [variant].concat(props.expanded ? ['expanded'] : ''))}>
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
