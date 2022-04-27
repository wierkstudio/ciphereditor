
import './operation.scss'
import ButtonView from 'views/button/button'
import ControlView from 'views/control/control'
import IconView from 'views/icon/icon'
import useAppDispatch from 'hooks/useAppDispatch'
import useBlueprintSelector from 'hooks/useBlueprintSelector'
import useClassName from 'hooks/useClassName'
import useHighestIssueType from 'hooks/useHighestIssueType'
import { BlueprintNodeId, BlueprintNodeType } from 'slices/blueprint/types/blueprint'
import { ControlNode } from 'slices/blueprint/types/control'
import { OperationNode, OperationState } from 'slices/blueprint/types/operation'
import { ProgramNode } from 'slices/blueprint/types/program'
import { enterProgramAction, retryOperationAction } from 'slices/blueprint'
import { getNode, getNodeChildren } from 'slices/blueprint/selectors/blueprint'
import { getOperationIssues } from 'slices/blueprint/selectors/operation'

export default function OperationView (props: {
  /**
   * Operation or program node id
   */
  nodeId: BlueprintNodeId
  contextProgramId: BlueprintNodeId
  onOutletRef?: (controlId: number, element: HTMLDivElement | null) => void
}): JSX.Element {
  const { nodeId, contextProgramId, onOutletRef } = props

  const dispatch = useAppDispatch()
  const node = useBlueprintSelector(state =>
    getNode(state, nodeId) as ProgramNode | OperationNode)

  // Retrieve sorted control ids and order numbers
  const controls = useBlueprintSelector(state =>
    (getNodeChildren(state, nodeId, BlueprintNodeType.Control) as ControlNode[])
      .slice()
      .sort((a, b) => a.order - b.order)
      .map(control => ({ id: control.id, order: control.order }))
  )

  const hasControlsBelowHeader =
    controls.find(control => control.order >= 1000) !== undefined

  const issues = useBlueprintSelector(state => getOperationIssues(state, nodeId))
  const highestIssueType = useHighestIssueType(issues)

  let doubleClickHandler
  let state = OperationState.Ready
  if (node.type === BlueprintNodeType.Program) {
    doubleClickHandler = () => {
      dispatch(enterProgramAction({ programId: nodeId }))
    }
  } else if (node.type === BlueprintNodeType.Operation) {
    state = node.state
  }

  // TODO: Right now, we assume that the last control conveys the 'result' of
  // the operation. Therefore we show the operation header above it. From a
  // semantic perspective the header contains the headline for the entire
  // operation and thus, it appears first in the DOM.

  const className = useClassName('operation', state.toString())

  return (
    <div
      className={className}
      onDoubleClick={doubleClickHandler}
    >
      <header
        className='operation__header'
        style={{ order: hasControlsBelowHeader ? 1000 : -1000 }}
      >
        <div className='operation__header-start'>
          <button
            className='operation__pill'
            title={issues.map(i =>
              i.message + (i.description !== undefined ? ': ' + i.description : '')
            ).join('; ')}
          >
            <span className='operation__icon'>
              <IconView icon='switch' />
            </span>
            <h3 className='operation__label'>
              {node.label}
            </h3>
            {highestIssueType !== undefined && (
              <div className={'operation__issue operation__issue--' + highestIssueType}>
                <IconView icon={highestIssueType} />
              </div>
            )}
          </button>
        </div>
        <div className='operation__header-end'>
          {node.type === BlueprintNodeType.Operation && node.state === OperationState.Error && (
            <ButtonView
              icon='refresh'
              title='Retry'
              onClick={() => dispatch(retryOperationAction({ nodeId }))}
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
            contextProgramId={contextProgramId}
            onOutletRef={onOutletRef}
          />
        </div>
      ))}
    </div>
  )
}
