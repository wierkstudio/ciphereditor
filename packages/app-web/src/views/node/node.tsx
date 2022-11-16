
import './node.scss'
import ControlView from '../../views/control/control'
import OperationView from '../../views/operation/operation'
import useAppDispatch from '../../hooks/useAppDispatch'
import useBlueprintSelector from '../../hooks/useBlueprintSelector'
import usePointerDrag, { PointerDragState } from '../../hooks/usePointerDrag'
import useResizeObserver from '@react-hook/resize-observer'
import { BlueprintNodeId, BlueprintNodeType } from '../../slices/blueprint/types/blueprint'
import { ControlNodeState } from '../../slices/blueprint/types/control'
import { Point, roundRect } from '@ciphereditor/library'
import { arrayRemove, arrayUniquePush } from '../../lib/utils/array'
import { getNode, getNodeChildren, getPlaneCanvas } from '../../slices/blueprint/selectors/blueprint'
import { layoutNodeAction, moveAction, selectAction } from '../../slices/blueprint'
import { renderClassName } from '../../lib/utils/dom'
import { useCallback, useLayoutEffect, useRef } from 'react'

export default function NodeView (props: {
  nodeId: BlueprintNodeId
}): JSX.Element {
  const nodeId = props.nodeId

  const dispatch = useAppDispatch()

  const node = useBlueprintSelector(state => getNode(state, nodeId))
  const frame = node.frame !== undefined ? roundRect(node.frame) : undefined
  const selectedNodeIds = useBlueprintSelector(state => state.selectedNodeIds)
  const isSelected = selectedNodeIds.includes(node.id)
  const planeCanvas = useBlueprintSelector(getPlaneCanvas)
  const controlIds = useBlueprintSelector(state => {
    const controls =
      node.type === BlueprintNodeType.Control
        ? [node as ControlNodeState]
        : getNodeChildren(state, node.id, BlueprintNodeType.Control) as ControlNodeState[]
    return controls.map(control => control.id)
  })

  const nodeRef = useRef<HTMLDivElement>(null)
  const outletRefs = useRef<Record<string, HTMLDivElement | undefined>>({})
  const onOutletRef = useCallback((controlId: number, element: HTMLDivElement | null) => {
    outletRefs.current[controlId] = element ?? undefined
  }, [outletRefs])

  /**
   * Measure the node size and the relative positions of the outlet indicators
   * it contains. This is an expensive operation, it should only be run when the
   * DOM changes. It SHOULD NOT be called when the node changes position.
   */
  const layoutNode = useCallback(() => {
    const nodeElement = nodeRef.current
    if (nodeElement === null) {
      return
    }

    const nodeClientRect = nodeElement.getBoundingClientRect()
    const size = { width: nodeClientRect.width, height: nodeClientRect.height }

    const outletPositions = controlIds.map(controlId => {
      const indicatorElement = outletRefs.current[controlId.toString()]
      const clientRect = indicatorElement?.getBoundingClientRect()
      const position = clientRect === undefined ? undefined : {
        x: Math.round(clientRect.x + clientRect.width * 0.5 - nodeClientRect.x),
        y: Math.round(clientRect.y + clientRect.height * 0.5 - nodeClientRect.y)
      }
      return { controlId, position }
    })

    dispatch(layoutNodeAction({ nodeId, size, outletPositions }))
  }, [dispatch, nodeRef, outletRefs, controlIds])

  // Trigger layout when a node resizes
  useResizeObserver(nodeRef, layoutNode)

  // Trigger layout when controls appear/disappear or get reordered as this
  // might not trigger the node to resize
  const controlIdString = controlIds.join(',')
  useLayoutEffect(layoutNode, [nodeId, controlIdString])

  const onPointerDrag = useCallback((
    state: PointerDragState,
    delta: Point,
    event: MouseEvent
  ) => {
    switch (state) {
      case 'move': {
        if (!isSelected) {
          dispatch(selectAction({ nodeIds: [nodeId] }))
        }
        dispatch(moveAction({ delta }))
        break
      }
      case 'cancel': {
        const append =
          event.getModifierState('Shift') ||
          event.getModifierState('Control') ||
          event.getModifierState('Meta')
        if (append) {
          const nodeIds = isSelected
            ? arrayRemove(selectedNodeIds, nodeId)
            : arrayUniquePush(selectedNodeIds, nodeId)
          dispatch(selectAction({ nodeIds }))
        } else {
          dispatch(selectAction({ nodeIds: [nodeId] }))
        }
        break
      }
    }
  }, [nodeId, selectedNodeIds, isSelected])

  const onPlanePointerDown = usePointerDrag(onPointerDrag)
  const onLinePointerDown = (): void => {
    dispatch(selectAction({ nodeIds: [nodeId] }))
  }

  const modifiers = isSelected ? ['selected'] : []

  return (
    <div
      ref={nodeRef}
      className={renderClassName('node', modifiers)}
      role='region'
      style={planeCanvas && frame !== undefined
        ? { transform: `translate(${frame.x}px, ${frame.y}px)` }
        : {}}
      tabIndex={0}
      onPointerDown={planeCanvas ? onPlanePointerDown : onLinePointerDown}
    >
      {(node.type === BlueprintNodeType.Operation || node.type === BlueprintNodeType.Program) && (
        <OperationView nodeId={nodeId} onOutletRef={onOutletRef} />
      )}
      {node.type === BlueprintNodeType.Control && (
        <ControlView controlId={nodeId} onOutletRef={onOutletRef} />
      )}
    </div>
  )
}
