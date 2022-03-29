
import './operation.scss'
import ControlView from 'views/control/control'
import IconView from 'views/icon/icon'
import useAppDispatch from 'hooks/useAppDispatch'
import useBlueprintSelector from 'hooks/useBlueprintSelector'
import { BlueprintNodeId, BlueprintNodeType } from 'slices/blueprint/types/blueprint'
import { OperationNode } from 'slices/blueprint/types/operation'
import { ProgramNode } from 'slices/blueprint/types/program'
import { enterProgramAction } from 'slices/blueprint'
import { getNode, getNodeChildren } from 'slices/blueprint/selectors/blueprint'

export default function OperationView (props: {
  /**
   * Operation or program node id
   */
  nodeId: BlueprintNodeId
  contextProgramId: BlueprintNodeId
  onOutletRef?: (controlId: number, element: HTMLButtonElement | null) => void
}): JSX.Element {
  const { nodeId, contextProgramId, onOutletRef } = props

  const dispatch = useAppDispatch()
  const node = useBlueprintSelector(state =>
    getNode(state, nodeId) as ProgramNode | OperationNode)
  const controlIds = useBlueprintSelector(state =>
    getNodeChildren(state, nodeId, BlueprintNodeType.Control)
      .map((control) => control.id))

  let doubleClickHandler
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
      className='operation'
      onDoubleClick={doubleClickHandler}
    >
      <header
        className='operation__header'
        style={{ order: controlIds.length - 1 }}
      >
        <span className='operation__icon'>
          <IconView icon='switch' />
        </span>
        <h3 className='operation__label'>
          {node.label}
        </h3>
      </header>
      {controlIds.map((id, index) => (
        <div
          key={id}
          className='operation__control'
          style={{ order: index }}
        >
          <ControlView
            controlId={id}
            contextProgramId={contextProgramId}
            onOutletRef={onOutletRef}
          />
        </div>
      ))}
    </div>
  )
}
