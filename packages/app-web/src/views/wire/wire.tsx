
import './wire.scss'
import useAppDispatch from '../../hooks/useAppDispatch'
import useBlueprintSelector from '../../hooks/useBlueprintSelector'
import { BlueprintNodeId } from '../../slices/blueprint/types/blueprint'
import { FocusEvent } from 'react'
import { getVariableWireWaypoints } from '../../slices/blueprint/selectors/variable'
import { isSelectedNode } from '../../slices/blueprint/selectors/blueprint'
import { renderClassName } from '../../lib/utils/dom'
import { selectNodeAction } from '../../slices/blueprint'

const minNodeGap = 48

const capIcons = {
  trailingPull: 'm-6,1c-0.667,-0.385,-0.667,-1.347,0,-1.732l9.75,-5.629c0.667,-0.385,1.5,0.096,1.5,0.866v11.258c0,0.77,-0.833,1.251,-1.5,0.866l-9.75,-5.629z',
  leadingPull: 'm6,-1c0.667,0.385,0.667,1.347,0,1.732l-9.75,5.629c-0.667,0.385,-1.5,-0.096,-1.5,-0.866l0,-11.258c0,-0.77,0.833,-1.251,1.5,-0.866l9.75,5.629z',
  trailingPush: 'm-6,0c0,-3.314,2.686,-6,6,-6c3.314,0,6,2.686,6,6c0,3.314,-2.686,6,-6,6c-3.314,0,-6,-2.686,-6,-6z',
  leadingPush: 'm-6,0c0,-3.314,2.686,-6,6,-6c3.314,0,6,2.686,6,6c0,3.314,-2.686,6,-6,6c-3.314,0,-6,-2.686,-6,-6z'
}

export default function WireView (props: {
  variableId: BlueprintNodeId
}): JSX.Element {
  const { variableId } = props

  const waypoints = useBlueprintSelector(state => getVariableWireWaypoints(state, variableId))
  const isSelected = useBlueprintSelector(state => isSelectedNode(state, variableId))
  const dispatch = useAppDispatch()

  const modifiers = isSelected ? ['selected'] : []
  const className = renderClassName('wire', modifiers)

  const count = waypoints.length

  if (count <= 1) {
    return <></>
  }

  // Sort waypoints by their trailing node positions from left to right
  const trailSortedWaypoints =
    waypoints.slice().sort((a, b) => (a.nodeX + a.nodeWidth) - (b.nodeX + b.nodeWidth))
  const leadSortedWaypoints =
    trailSortedWaypoints.slice().sort((a, b) => a.nodeX - b.nodeX)
  const verticalSortedWaypoints =
    waypoints.slice().sort((a, b) => a.y - b.y)

  // Detemine SVG canvas size
  const leading = leadSortedWaypoints[0]
  const trailing = trailSortedWaypoints[count - 1]
  const x = leading.nodeX + leading.nodeWidth + 1
  const width = Math.max((trailing.nodeX + trailing.nodeWidth + 1 + minNodeGap) - x, 10)

  const top = verticalSortedWaypoints[0]
  const bottom = verticalSortedWaypoints[count - 1]
  const y = top.y
  const height = Math.max(bottom.y - y, 10)

  // Find vertical gaps between nodes
  const gaps: Array<[number, number]> = []
  let currentX = x
  for (let i = 1; i < count; i++) {
    const { nodeX, nodeWidth } = leadSortedWaypoints[i]
    if (currentX < nodeX) {
      gaps.push([currentX, nodeX - 1])
    }
    currentX = nodeX + nodeWidth + 1
  }

  // TODO: Remove magic value '14'
  gaps.push([currentX, currentX + minNodeGap + 14])

  // TODO: Choose the best gap (initial strategy: choose the first one)
  const gap = gaps.find(([fromX, toX]) => toX - fromX >= minNodeGap)
  if (gap === undefined) {
    throw new Error('Assertion error: There is always a suitable gap')
  }

  const verticalX = Math.round((gap[1] + gap[0]) * 0.5)

  // Layout connection points
  const points = verticalSortedWaypoints.map(waypoint =>
    verticalX >= waypoint.nodeX + waypoint.nodeWidth * 0.5
      ? {
          icon: waypoint.push ? capIcons.trailingPush : capIcons.trailingPull,
          x: waypoint.nodeX + waypoint.nodeWidth + 9,
          y: waypoint.y
        }
      : {
          icon: waypoint.push ? capIcons.leadingPush : capIcons.leadingPull,
          x: waypoint.nodeX - 9,
          y: waypoint.y
        }
  )

  // Paint outside line first
  // TODO: Add rounded corners
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
      points[i].icon
  }

  const onFocus = (event: FocusEvent): void => {
    event.stopPropagation()
    if (!isSelected) {
      dispatch(selectNodeAction({ nodeId: variableId }))
    }
  }

  // TODO: Optimize the number of elements used here
  // Currently we need two separate SVG elements to create a separate stacking
  // context on top of the nodes for the cap icons only.
  return (
    <div
      className={className}
      tabIndex={0}
      onPointerDown={event => event.stopPropagation()}
      onFocus={onFocus}
    >
      <svg
        className='wire__svg-wire'
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ transform: `translate(${x}px, ${y}px)` }}
      >
        <path className='wire__path-shadow' d={wireD} />
        <path className='wire__path-wire' d={wireD} />
      </svg>
      <svg
        className='wire__svg-caps'
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ transform: `translate(${x}px, ${y}px)` }}
      >
        <path className='wire__path-caps' d={capsD} />
      </svg>
    </div>
  )
}
