
import './control.scss'
import ChangingTextView from 'views/changing-text/changing-text'
import ControlDrawerView from 'views/control-drawer/control-drawer'
import IconView from 'views/icon/icon'
import MovableButtonView from 'views/movable-button/movable-button'
import OutletView from 'views/outlet/outlet'
import useAppDispatch from 'hooks/useAppDispatch'
import useBlueprintSelector from 'hooks/useBlueprintSelector'
import useClassName from 'hooks/useClassName'
import { BlueprintNodeId } from 'slices/blueprint/types/blueprint'
import { ControlViewState } from 'slices/blueprint/types/control'
import { MouseEvent, useCallback } from 'react'
import { getControlNode, getControlPreview } from 'slices/blueprint/selectors/control'
import { toggleControlViewState } from 'slices/blueprint'

export default function ControlView(props: {
  controlId: BlueprintNodeId
  contextProgramId: BlueprintNodeId
  onOutletRef?: (controlId: number, element: HTMLButtonElement | null) => void
}) {
  const { controlId, contextProgramId, onOutletRef } = props

  const control = useBlueprintSelector(state => getControlNode(state, controlId))
  const valuePreview = useBlueprintSelector(state =>
    getControlPreview(state, controlId))

  const dispatch = useAppDispatch()
  const onToggleClick = useCallback((event: MouseEvent) => {
    dispatch(toggleControlViewState({ controlId }))
  }, [dispatch, controlId])

  const modifiers = control.viewState === ControlViewState.Expanded ? ['expanded']: []

  return (
    <div className={useClassName('control', modifiers)}>
      <div className="control__header">
        <MovableButtonView className="control__header-toggle" onClick={onToggleClick}>
          <div className="control__header-pill">
            <div className="control__header-chevron">
              <IconView icon="chevronDown" />
            </div>
            <h4 className="control__header-name">
              {control.label}
            </h4>
          </div>
          {control.viewState === ControlViewState.Collapsed && valuePreview !== undefined && (
            <div className="control__header-preview">
              <ChangingTextView>{valuePreview}</ChangingTextView>
            </div>
          )}
        </MovableButtonView>
        <OutletView
          control={control}
          contextProgramId={contextProgramId}
          expanded={control.viewState === ControlViewState.Expanded}
          onIndicatorClick={onToggleClick}
          indicatorRef={onOutletRef?.bind(null, controlId)}
        />
      </div>
      {control.viewState === ControlViewState.Expanded && (
        <ControlDrawerView control={control} contextProgramId={contextProgramId} />
      )}
    </div>
  )
}
