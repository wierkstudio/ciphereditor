
import './blueprint.scss'
import ControlView from 'views/control/control'
import OperationView from '../operation/operation'
import { BlueprintNodeType } from 'slices/blueprint/types/blueprint'
import { ControlNode } from 'slices/blueprint/types/control'
import { OperationNode } from 'slices/blueprint/types/operation'
import { ProgramNode } from 'slices/blueprint/types/program'
import { getActiveProgram } from 'slices/blueprint/selectors/program'
import { getNodeChildren } from 'slices/blueprint/selectors/blueprint'
import { selectNodeAction } from 'slices/blueprint'
import { useAppDispatch, useBlueprintSelector } from 'utils/hooks'

export default function BlueprintView() {
  const dispatch = useAppDispatch()
  const activeProgram = useBlueprintSelector(state => getActiveProgram(state))!
  const nodes = useBlueprintSelector(state => getNodeChildren(state, activeProgram.id))
    .filter(node => node.type !== BlueprintNodeType.Variable)
  return (
    <div
      className="blueprint"
      onBlur={() => dispatch(selectNodeAction({ nodeId: undefined }))}
    >
      <div className="blueprint__canvas">
        {nodes.map(node => (
          <div className="blueprint__node" key={node.id}>
            {(node.type === BlueprintNodeType.Operation || node.type === BlueprintNodeType.Program) && (
              <OperationView
                operation={node as OperationNode|ProgramNode}
                program={activeProgram}
              />
            )}
            {node.type === BlueprintNodeType.Control && (
              <ControlView
                control={node as ControlNode}
                program={activeProgram}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
