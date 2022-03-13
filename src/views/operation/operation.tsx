
import './operation.scss'
import ControlView from 'views/control/control'
import IconView from 'views/icon/icon'
import { BlueprintNodeId, BlueprintNodeType } from 'slices/blueprint/types/blueprint'
import { OperationNode } from 'slices/blueprint/types/operation'
import { ProgramNode } from 'slices/blueprint/types/program'
import { enterProgramAction, selectNodeAction } from 'slices/blueprint'
import { getNode, getNodeChildren } from 'slices/blueprint/selectors/blueprint'
import { useAppDispatch } from 'hooks/useAppDispatch'
import { useBlueprintSelector } from 'hooks/useBlueprintSelector'

export default function OperationView(props: {
  /**
   * Operation or control node id
   */
  nodeId: BlueprintNodeId
  contextProgramId: BlueprintNodeId
}) {
  const { nodeId, contextProgramId } = props

  const node = useBlueprintSelector(state =>
    getNode(state, nodeId) as ProgramNode | OperationNode)
  const controlIds = useBlueprintSelector(state =>
    getNodeChildren(state, nodeId, BlueprintNodeType.Control)
      .map(node => node.id) as BlueprintNodeId[])

  const dispatch = useAppDispatch()

  let doubleClickHandler = undefined
  if (node.type === BlueprintNodeType.Program) {
    doubleClickHandler = () => {
      dispatch(enterProgramAction({ programId: nodeId }))
    }
  }

  // TODO: Right now, we assume that the last control conveys the 'result' of
  // the operation. Therefore we show the operation header above it. From a
  // semantic perspective the header contains the headline for the entire
  // operation and thus, it appears first in the DOM.

  return (
    <div
      className="operation"
      role="region"
      tabIndex={0}
      onFocus={() => dispatch(selectNodeAction({ nodeId }))}
      onDoubleClick={doubleClickHandler}
    >
      <header
        className="operation__header"
        style={{ order: controlIds.length - 1 }}
      >
        <span className="operation__icon">
          <IconView icon="switch" />
        </span>
        <h3 className="operation__label">
          {node.label}
        </h3>
      </header>
      {controlIds.map((controlId, index) => (
        <div
          key={controlId}
          className="operation__control"
          style={{ order: index }}
        >
          <ControlView
            controlId={controlId}
            contextProgramId={contextProgramId}
          />
        </div>
      ))}
    </div>
  )
}
