
import './control.scss'
import ControlDrawerView from 'views/control-drawer/control-drawer'
import MovableButtonView from 'views/movable-button/movable-button'
import OutletView from 'views/outlet/outlet'
import { BlueprintNodeId } from 'slices/blueprint/types/blueprint'
import { ControlViewState } from 'slices/blueprint/types/control'
import { MouseEvent } from 'react'
import { ReactComponent as ChevronDownIcon } from 'icons/chevron-down.svg'
import { ReactComponent as ChevronUpIcon } from 'icons/chevron-up.svg'
import { getControlNode, getControlPreview } from 'slices/blueprint/selectors/control'
import { toggleControlViewState } from 'slices/blueprint'
import { useAppDispatch } from 'hooks/useAppDispatch'
import { useBlueprintSelector } from 'hooks/useBlueprintSelector'

export default function ControlView(props: {
  controlId: BlueprintNodeId
  contextProgramId: BlueprintNodeId
}) {
  const { controlId, contextProgramId } = props

  const control = useBlueprintSelector(state => getControlNode(state, controlId))
  const valuePreview = useBlueprintSelector(state =>
    getControlPreview(state, controlId))

  const dispatch = useAppDispatch()
  const onToggleClick = (event: MouseEvent) => {
    dispatch(toggleControlViewState({ controlId }))
  }

  return (
    <div className="control">
      <div className="control__header">
        <MovableButtonView className="control__header-toggle" onClick={onToggleClick}>
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
        </MovableButtonView>
        <OutletView
          control={control}
          contextProgramId={contextProgramId}
          expanded={control.viewState === ControlViewState.Expanded}
          onIndicatorClick={onToggleClick}
        />
      </div>
      {control.viewState === ControlViewState.Expanded && (
        <ControlDrawerView control={control} contextProgramId={contextProgramId} />
      )}
    </div>
  )
}
