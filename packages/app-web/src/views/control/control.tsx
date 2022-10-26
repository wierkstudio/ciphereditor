
import './control.scss'
import ChangingTextView from '../../views/changing-text/changing-text'
import ControlDrawerView from '../../views/control-drawer/control-drawer'
import IconView from '../../views/icon/icon'
import MovableButtonView from '../../views/movable-button/movable-button'
import OutletView from '../../views/outlet/outlet'
import useAppDispatch from '../../hooks/useAppDispatch'
import useAppSelector from '../../hooks/useAppSelector'
import useBlueprintSelector from '../../hooks/useBlueprintSelector'
import { BlueprintNodeId } from '../../slices/blueprint/types/blueprint'
import { MouseEvent, useCallback, useEffect, useRef } from 'react'
import { canAttachControls, getControlNode, getControlPreview } from '../../slices/blueprint/selectors/control'
import { chooseMostImportantIssue } from '@ciphereditor/library'
import { getOperationIssues } from '../../slices/blueprint/selectors/operation'
import { getWireDraft } from '../../slices/ui/selectors'
import { renderClassName } from '../../lib/utils/dom'
import { targetWireAction } from '../../slices/ui'
import { toggleControlVisibility } from '../../slices/blueprint'

export default function ControlView (props: {
  controlId: BlueprintNodeId
  outward?: boolean
  onOutletRef?: (controlId: number, element: HTMLDivElement | null) => void
}): JSX.Element {
  const { controlId, outward = false, onOutletRef } = props

  const headerRef = useRef<HTMLDivElement | null>(null)

  const control = useBlueprintSelector(state => getControlNode(state, controlId))
  const valuePreview = useBlueprintSelector(state =>
    getControlPreview(state, controlId))

  const issues = useBlueprintSelector(state => getOperationIssues(state, controlId))
  const highestIssueLevel = chooseMostImportantIssue(issues)?.level

  const isWireTarget = useAppSelector(state => getWireDraft(state.ui)?.targetControlId === controlId)
  const isWireTargetable = useAppSelector(state => {
    if (state.ui.wireDraft === undefined) {
      return false
    }
    return canAttachControls(
      state.blueprint.present,
      state.ui.wireDraft.sourceControlId,
      controlId,
      outward
    )
  })

  const dispatch = useAppDispatch()
  const onToggleClick = useCallback((event: MouseEvent) => {
    dispatch(toggleControlVisibility({ controlId }))
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
  if (control.visibility === 'expanded') {
    modifiers.push('expanded')
  }
  if (isWireTarget) {
    modifiers.push('wire-target')
  }
  if (isWireTargetable) {
    modifiers.push('wire-targetable')
  }

  return (
    <div className={renderClassName('control', modifiers)}>
      <div className='control__header' ref={headerRef}>
        <MovableButtonView
          className='control__toggle'
          onClick={onToggleClick}
          title={control.description}
        >
          <div className='control__pill'>
            <div className='control__chevron'>
              <IconView icon='chevronDown' />
            </div>
            <h4 className='control__name'>
              {control.label}
            </h4>
            {highestIssueLevel !== undefined && (
              <div className={'control__issue control__issue--' + String(highestIssueLevel)}>
                <IconView icon={highestIssueLevel} />
              </div>
            )}
          </div>
          {control.visibility === 'collapsed' && valuePreview !== undefined && (
            <div className='control__preview'>
              <ChangingTextView>{valuePreview}</ChangingTextView>
            </div>
          )}
        </MovableButtonView>
        <OutletView
          control={control}
          outward={outward}
          expanded={control.visibility === 'expanded'}
          onIndicatorClick={onToggleClick}
          indicatorRef={onOutletRef?.bind(null, controlId)}
        />
      </div>
      {control.visibility === 'expanded' && (
        <ControlDrawerView control={control} outward={outward} />
      )}
    </div>
  )
}
