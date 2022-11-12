
import './node.scss'
import ControlView from '../../views/control/control'
import OperationView from '../../views/operation/operation'
import useAppDispatch from '../../hooks/useAppDispatch'
import useBlueprintSelector from '../../hooks/useBlueprintSelector'
import usePointerDrag, { PointerDragState } from '../../hooks/usePointerDrag'
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

  const controls = useBlueprintSelector(state => {
    const controlNodes =
      node.type === BlueprintNodeType.Control
        ? [node as ControlNodeState]
        : getNodeChildren(state, node.id, BlueprintNodeType.Control) as ControlNodeState[]
    return controlNodes.map(control => ({
      id: control.id,
      nodeOutletX: control.nodeOutletX,
      nodeOutletY: control.nodeOutletY
    }))
  })

  const nodeRef = useRef<HTMLDivElement>(null)
  const outletRefs = useRef<{ [controlId: string]: HTMLDivElement | undefined }>({})
  const onOutletRef = useCallback((controlId: number, element: HTMLDivElement | null) => {
    if (element !== null) {
      outletRefs.current[controlId] = element
    } else {
      outletRefs.current[controlId] = undefined
    }
  }, [outletRefs])

  useLayoutEffect(() => {
    // TODO: Optimization: Measuring things is expensive, this should only be
    // run when actual changes are applied to the DOM
    // TODO: Optimization: This should NOT be called when the node gets moved
    const nodeElement = nodeRef.current
    if (frame !== undefined && nodeElement !== null) {
      const outletPositions: Array<{
        controlId: BlueprintNodeId
        x: number | undefined
        y: number | undefined
      }> = []

      const nodeRect = nodeElement.getBoundingClientRect()
      const width = nodeRect.width
      const height = nodeRect.height

      for (let i = 0; i < controls.length; i++) {
        const control = controls[i]
        let x: number | undefined
        let y: number | undefined

        // Retrieve indicator element for this control
        const indicatorElement = outletRefs.current[control.id.toString()]
        if (indicatorElement !== undefined) {
          // Measure indicator rect and calculate its relative position within
          // the operation node component
          const rect = indicatorElement.getBoundingClientRect()
          x = Math.round(rect.x + rect.width * 0.5 - nodeRect.x)
          y = Math.round(rect.y + rect.height * 0.5 - nodeRect.y)
        }

        // Return only indicator positions that changed
        if (control.nodeOutletX !== x || control.nodeOutletY !== y) {
          outletPositions.push({ controlId: control.id, x, y })
        }
      }

      if (
        frame.width !== width ||
        frame.height !== height ||
        outletPositions.length > 0
      ) {
        dispatch(layoutNodeAction({ nodeId, width, height, outletPositions }))
      }
    }
  }, [nodeRef, outletRefs, frame, controls])

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

  const onPointerDown = usePointerDrag(onPointerDrag)

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
      onPointerDown={planeCanvas ? onPointerDown : undefined}
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
