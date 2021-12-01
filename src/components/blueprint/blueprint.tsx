
import Node from '../node/node'
import { getActiveProgram } from 'slices/blueprint/selectors/program'
import { getNodeChildren } from 'slices/blueprint/selectors/blueprint'
import { useAppSelector } from '../../utils/hooks'
import './blueprint.scss'

type BlueprintProps = {
}

function Blueprint(props: BlueprintProps) {
  const activeProgram = useAppSelector(state => getActiveProgram(state.blueprint))!
  const nodes = useAppSelector(state => getNodeChildren(state.blueprint, activeProgram.id))
  return (
    <div className="blueprint">
      <div className="blueprint__canvas">
        {nodes.map(node => (
          <div className="blueprint__node" key={node.id}>
            <Node node={node} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Blueprint
