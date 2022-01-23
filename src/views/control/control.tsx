
import './control.scss'
import ControlDrawerView from 'views/control-drawer/control-drawer'
import OutletView from 'views/outlet/outlet'
import { ControlNode, ControlViewState } from 'types/control'
import { ProgramNode } from 'types/program'
import { ReactComponent as ChevronDownIcon } from 'icons/chevron-down.svg'
import { ReactComponent as ChevronUpIcon } from 'icons/chevron-up.svg'
import { toggleControlViewState } from 'slices/blueprint'
import { useAppDispatch, useBlueprintSelector } from 'utils/hooks'
import { getControlPreview } from 'slices/blueprint/selectors/control'

export default function ControlView(props: {
  control: ControlNode
  program: ProgramNode
}) {
  const { control, program } = props
  const dispatch = useAppDispatch()
  const toggleHandler = () =>
    dispatch(toggleControlViewState({ controlId: control.id }))
  const valuePreview = useBlueprintSelector(state =>
    getControlPreview(state, control.id))

  return (
    <div className="control">
      <div className="control__header">
        <button className="control__header-toggle" onClick={toggleHandler}>
          <div className="control__header-chevron">
            {control.viewState === ControlViewState.Expanded
              ? <ChevronUpIcon />
              : <ChevronDownIcon />}
          </div>
          <h4 className="control__header-name">
            {control.label}
          </h4>
          {control.viewState === ControlViewState.Collapsed && valuePreview !== undefined && (
            <span className="control__header-preview">
              {valuePreview}
            </span>
          )}
        </button>
        <OutletView
          control={control}
          program={program}
          expanded={control.viewState === ControlViewState.Expanded}
          onIndicatorClick={toggleHandler}
        />
      </div>
      {control.viewState === ControlViewState.Expanded && (
        <ControlDrawerView control={props.control} program={props.program} />
      )}
    </div>
  )
}
