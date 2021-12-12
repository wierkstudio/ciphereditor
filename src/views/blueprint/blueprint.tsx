
import NodeView from '../node/node'
import { getActiveProgram } from 'slices/blueprint/selectors/program'
import { getNodeChildren } from 'slices/blueprint/selectors/blueprint'
import { useAppDispatch, useBlueprintSelector } from 'utils/hooks'
import { selectNodeAction } from 'slices/blueprint'
import { BlueprintNodeType } from 'types/blueprint'
import './blueprint.scss'

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
            <NodeView node={node} program={activeProgram} />
          </div>
        ))}
      </div>
    </div>
  )
}
