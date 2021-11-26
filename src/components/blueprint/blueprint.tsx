
import Node from '../node/node'
import { getActiveProgram } from 'slices/blueprint/selectors/program'
import { getNodeChildren } from 'slices/blueprint/selectors/blueprint'
import { useAppSelector } from '../../utils/hooks'

type BlueprintProps = {
}

function Blueprint(props: BlueprintProps) {
  const activeProgram = useAppSelector(state => getActiveProgram(state.blueprint))!
  const nodes = useAppSelector(state => getNodeChildren(state.blueprint, activeProgram.id))
  return (
    <div className="blueprint">
      Label: {activeProgram.label}<br />
      Children:
      <ul>
        {nodes.map(node => (
          <li key={node.id}>
            <Node node={node} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Blueprint
