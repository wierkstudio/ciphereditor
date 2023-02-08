
import './operation.scss'
import ButtonView from '../../views/button/button'
import ControlView from '../../views/control/control'
import IconView from '../../views/icon/icon'
import MovableButtonView from '../movable-button/movable-button'
import useAppDispatch from '../../hooks/useAppDispatch'
import useBlueprintSelector from '../../hooks/useBlueprintSelector'
import useTranslation from '../../hooks/useTranslation'
import { BlueprintNodeId } from '../../slices/blueprint/types/blueprint'
import { ControlNodeState } from '../../slices/blueprint/types/control'
import { OperationNodeState } from '../../slices/blueprint/types/operation'
import { ProgramNodeState } from '../../slices/blueprint/types/program'
import { chooseMostImportantIssue } from '@ciphereditor/library'
import { enterProgramAction, executeOperationAction } from '../../slices/blueprint'
import { getNode, getNodeChildren } from '../../slices/blueprint/selectors/blueprint'
import { getOperationIssues } from '../../slices/blueprint/selectors/operation'
import { pushModalAction } from '../../slices/ui'
import { renderClassName } from '../../lib/utils/dom'

export default function OperationView (props: {
  /**
   * Operation or program node id
   */
  nodeId: BlueprintNodeId
  onOutletRef?: (controlId: number, element: HTMLDivElement | null) => void
}): JSX.Element {
  const { nodeId, onOutletRef } = props

  const dispatch = useAppDispatch()
  const [t] = useTranslation()
  const node = useBlueprintSelector(state =>
    getNode(state, nodeId) as ProgramNodeState | OperationNodeState)

  // Retrieve sorted control ids and order numbers
  const controls = useBlueprintSelector(state =>
    (getNodeChildren(state, nodeId, 'control') as ControlNodeState[])
      .slice()
      .sort((a, b) => a.order - b.order)
      .map(control => ({ id: control.id, order: control.order }))
  )

  const hasControlsBelowHeader =
    controls.find(control => control.order >= 1000) !== undefined

  const issues = useBlueprintSelector(state => getOperationIssues(state, nodeId))
  const highestIssueLevel = chooseMostImportantIssue(issues)?.level

  let state: OperationNodeState['state'] = 'ready'
  if (node.type === 'operation') {
    state = node.state
  }

  const canExecute =
    node.type === 'operation' &&
    node.state !== 'busy' &&
    (!node.reproducible || node.state === 'error')

  // TODO: Right now, we assume that the last control conveys the 'result' of
  // the operation. Therefore we show the operation header above it. From a
  // semantic perspective the header contains the headline for the entire
  // operation and thus, it appears first in the DOM.

  const className = renderClassName('operation', state.toString())

  return (
    <div className={className}>
      <header
        className='operation__header'
        style={{ order: hasControlsBelowHeader ? 1000 : -1000 }}
      >
        <div className='operation__header-start'>
          <MovableButtonView
            className='operation__pill'
            title={node.alias !== undefined ? node.label : undefined}
            onClick={() => dispatch(pushModalAction({
              payload: {
                type: 'operation',
                nodeId
              }
            }))}
          >
            <span className='operation__icon'>
              <IconView icon={node.type === 'program' ? 'program' : 'switch'} />
            </span>
            <h3 className='operation__label'>
              {node.alias ?? node.label}
            </h3>
            {highestIssueLevel !== undefined && (
              <div className={'operation__issue operation__issue--' + String(highestIssueLevel)}>
                <IconView icon={highestIssueLevel} />
              </div>
            )}
          </MovableButtonView>
        </div>
        <div className='operation__header-end'>
          {canExecute && (
            <ButtonView
              icon='refresh'
              title={t('(Re-)execute operation')}
              onClick={() => dispatch(executeOperationAction({ nodeId }))}
            />
          )}
          {node.type === 'program' && (
            <ButtonView
              icon='edit'
              title={t('Edit program')}
              onClick={() => dispatch(enterProgramAction({ programId: nodeId }))}
            />
          )}
        </div>
      </header>
      {controls.map(control => (
        <div
          key={control.id}
          className='operation__control'
          style={{ order: control.order }}
        >
          <ControlView
            controlId={control.id}
            onOutletRef={onOutletRef}
            outward
          />
        </div>
      ))}
    </div>
  )
}
