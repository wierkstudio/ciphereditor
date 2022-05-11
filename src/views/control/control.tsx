
import './control.scss'
import ChangingTextView from 'views/changing-text/changing-text'
import ControlDrawerView from 'views/control-drawer/control-drawer'
import IconView from 'views/icon/icon'
import MovableButtonView from 'views/movable-button/movable-button'
import OutletView from 'views/outlet/outlet'
import useAppDispatch from 'hooks/useAppDispatch'
import useAppSelector from 'hooks/useAppSelector'
import useBlueprintSelector from 'hooks/useBlueprintSelector'
import useClassName from 'hooks/useClassName'
import useHighestIssueType from 'hooks/useHighestIssueType'
import { BlueprintNodeId } from 'slices/blueprint/types/blueprint'
import { ControlViewState } from 'slices/blueprint/types/control'
import { MouseEvent, useCallback, useEffect, useRef } from 'react'
import { canAttachControls, getControlNode, getControlPreview } from 'slices/blueprint/selectors/control'
import { getOperationIssues } from 'slices/blueprint/selectors/operation'
import { getWireDraft } from 'slices/ui/selectors'
import { targetWireAction } from 'slices/ui'
import { toggleControlViewState } from 'slices/blueprint'

export default function ControlView (props: {
  controlId: BlueprintNodeId
  contextProgramId: BlueprintNodeId
  onOutletRef?: (controlId: number, element: HTMLDivElement | null) => void
}): JSX.Element {
  const { controlId, contextProgramId, onOutletRef } = props

  const headerRef = useRef<HTMLDivElement | null>(null)

  const control = useBlueprintSelector(state => getControlNode(state, controlId))
  const valuePreview = useBlueprintSelector(state =>
    getControlPreview(state, controlId))

  const issues = useBlueprintSelector(state => getOperationIssues(state, controlId))
  const highestIssueType = useHighestIssueType(issues)

  const isWireTarget = useAppSelector(state => getWireDraft(state.ui)?.targetControlId === controlId)
  const isWireTargetable = useAppSelector(state => {
    if (state.ui.wireDraft === undefined) {
      return false
    }
    return canAttachControls(
      state.blueprint.present,
      state.ui.wireDraft.sourceControlId,
      controlId,
      contextProgramId
    )
  })

  const dispatch = useAppDispatch()
  const onToggleClick = useCallback((event: MouseEvent) => {
    dispatch(toggleControlViewState({ controlId }))
  }, [dispatch, controlId])

  useEffect(() => {
    if (isWireTargetable) {
      const onEnter = (): void => {
        dispatch(targetWireAction({ controlId: controlId }))
      }
      const onLeave = (): void => {
        dispatch(targetWireAction({ controlId: undefined }))
      }

      const headerElement = headerRef.current
      if (headerElement !== null) {
        headerElement.addEventListener('pointerenter', onEnter)
        headerElement.addEventListener('pointerleave', onLeave)

        return () => {
          headerElement.removeEventListener('pointerenter', onEnter)
          headerElement.removeEventListener('pointerleave', onLeave)
        }
      }
    }
  }, [dispatch, headerRef, isWireTargetable, controlId])

  // Compose modifiers
  const modifiers: string[] = []
  if (control.viewState === ControlViewState.Expanded) {
    modifiers.push('expanded')
  }
  if (isWireTarget) {
    modifiers.push('wire-target')
  }
  if (isWireTargetable) {
    modifiers.push('wire-targetable')
  }

  return (
    <div className={useClassName('control', modifiers)}>
      <div className='control__header' ref={headerRef}>
        <MovableButtonView
          className='control__toggle'
          onClick={onToggleClick}
          title={issues.map(i =>
            i.message + (i.description !== undefined ? ': ' + i.description : '')
          ).join('; ')}
        >
          <div className='control__pill'>
            <div className='control__chevron'>
              <IconView icon='chevronDown' />
            </div>
            <h4 className='control__name'>
              {control.label}
            </h4>
            {highestIssueType !== undefined && (
              <div className={'control__issue control__issue--' + highestIssueType}>
                <IconView
                  icon={highestIssueType}
                />
              </div>
            )}
          </div>
          {control.viewState === ControlViewState.Collapsed && valuePreview !== undefined && (
            <div className='control__preview'>
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
