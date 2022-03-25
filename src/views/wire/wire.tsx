
import './wire.scss'
import useAppDispatch from 'hooks/useAppDispatch'
import useBlueprintSelector from 'hooks/useBlueprintSelector'
import useClassName from 'hooks/useClassName'
import { BlueprintNodeId } from 'slices/blueprint/types/blueprint'
import { getVariableWireWaypoints } from 'slices/blueprint/selectors/variable'
import { isSelectedNode } from 'slices/blueprint/selectors/blueprint'
import { selectNodeAction } from 'slices/blueprint'

const minimumGap = 80
const pullD = ''
const pushD = ''

export default function WireView(props: {
  variableId: BlueprintNodeId,
}) {
  const { variableId } = props

  // const variable = useBlueprintSelector(state => getVariableNode(state, variableId))
  const waypoints = useBlueprintSelector(state => getVariableWireWaypoints(state, variableId))
  // const contextProgramId = variable.parentId

  const isSelected = useBlueprintSelector(state => isSelectedNode(state, variableId))
  const dispatch = useAppDispatch()

  const modifiers = isSelected ? ['selected'] : []
  const className = useClassName('wire', modifiers)

  const count = waypoints.length

  if (count <= 1) {
    return null
  }

  // Sort waypoints by their trailing node positions from left to right
  const trailSortedWaypoints =
    waypoints.slice().sort((a, b) => (a.nodeX + a.nodeWidth) - (b.nodeX + b.nodeWidth))
  const leadSortedWaypoints =
    trailSortedWaypoints.slice().sort((a, b) => a.nodeX - b.nodeX)
  const verticalSortedWaypoints =
    waypoints.slice().sort((a, b) => a.y - b.y)

  // Find vertical gaps between nodes
  const leading = leadSortedWaypoints[0]
  const trailing = trailSortedWaypoints[count - 1]
  const top = verticalSortedWaypoints[0]
  const bottom = verticalSortedWaypoints[count - 1]

  const x = leading.nodeX + leading.nodeWidth + 1
  const width = Math.max((trailing.nodeX + trailing.nodeWidth + 1 + minimumGap) - x, 10)
  const y = top.y
  const height = Math.max(bottom.y - y, 10)

  const gaps: [number, number][] = []

  let currentX = x
  for (let i = 1; i < count; i++) {
    const { nodeX, nodeWidth } = leadSortedWaypoints[i]
    if (currentX < nodeX) {
      gaps.push([currentX, nodeX - 1])
    }
    currentX = nodeX + nodeWidth + 1
  }

  gaps.push([currentX, currentX + minimumGap])

  // TODO: Choose the best gap
  const gap = gaps.find(([fromX, toX]) => toX - fromX >= minimumGap)!

  const verticalX = Math.round((gap[1] + gap[0]) * 0.5)

  const points = verticalSortedWaypoints.map(waypoint =>
    verticalX >= waypoint.nodeX + waypoint.nodeWidth * 0.5
      ? { push: waypoint.push, x: waypoint.nodeX + waypoint.nodeWidth, y: waypoint.y }
      : { push: waypoint.push, x: waypoint.nodeX, y: waypoint.y }
  )

  // Paint outside line first
  let wireD =
    `M ${points[0].x - x},${points[0].y - y} ` +
    `L ${verticalX - x},${points[0].y - y} ` +
    `L ${verticalX - x},${points[count - 1].y - y} ` +
    `L ${points[count - 1].x - x},${points[count - 1].y - y} `

  // Paint inside lines
  for (let i = 1; i < count - 1; i++) {
    wireD +=
      `M ${points[i].x - x},${points[i].y - y} ` +
      `L ${verticalX - x},${points[i].y - y} `
  }

  // Paint caps
  let capsD = ''
  for (let i = 0; i < count; i++) {
    capsD +=
      `M ${points[i].x - x},${points[i].y - y} ` +
      `${points[i].push ? pushD : pullD} `
  }

  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ transform: `translate(${x}px, ${y}px)` }}
      tabIndex={0}
      onFocus={() => dispatch(selectNodeAction({ nodeId: variableId }))}
    >
      <path className="wire__shadow" d={wireD} />
      <path className="wire__line" d={wireD} />
      <path className="wire__caps" d={capsD} />
    </svg>
  )
}
