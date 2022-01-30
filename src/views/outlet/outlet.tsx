
import './outlet.scss'
import { ControlNode } from 'slices/blueprint/types/control'
import { ProgramNode } from 'slices/blueprint/types/program'
import { ReactComponent as OutletPullIcon } from 'icons/outlet-pull.svg'
import { ReactComponent as OutletPushIcon } from 'icons/outlet-push.svg'
import { ReactComponent as OutletUnusedIcon } from 'icons/outlet-unused.svg'
import { getControlVariable, getVariableControl } from 'slices/blueprint/selectors/variable'
import { useAppClassName, useBlueprintSelector } from 'utils/hooks'
import { MouseEventHandler } from 'react'
import OutletSelectView from 'views/outlet-select/outlet-select'

export default function OutletView(props: {
  control: ControlNode
  program: ProgramNode
  expanded: boolean
  onIndicatorClick?: MouseEventHandler<HTMLButtonElement>
}) {
  const { control, program } = props

  const attachedVariable = useBlueprintSelector(state =>
    getControlVariable(state, props.control.id, props.program.id))
  const attachedVariableSourceControl = useBlueprintSelector(state =>
    attachedVariable ? getVariableControl(state, attachedVariable.id) : undefined)

  const isUnused = attachedVariable === undefined
  const isPushing = attachedVariableSourceControl && attachedVariableSourceControl.id === control.id
  const variant = isUnused ? 'unused' : (isPushing ? 'push' : 'pull')

  return (
    <div className={useAppClassName('outlet', [variant].concat(props.expanded ? ['expanded'] : ''))}>
      {props.expanded && (
        <div className="outlet__select">
          <OutletSelectView control={control} program={program} />
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
