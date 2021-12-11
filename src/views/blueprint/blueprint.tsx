
import NodeView from '../node/node'
import { getActiveProgram } from 'slices/blueprint/selectors/program'
import { getNodeChildren } from 'slices/blueprint/selectors/blueprint'
import { useAppDispatch, useAppSelector } from 'utils/hooks'
import { selectNodeAction } from 'slices/blueprint'
import './blueprint.scss'

export default function BlueprintView() {
  const dispatch = useAppDispatch()
  const activeProgram = useAppSelector(state => getActiveProgram(state.blueprint))!
  const nodes = useAppSelector(state => getNodeChildren(state.blueprint, activeProgram.id))
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
