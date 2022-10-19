
import './node.scss'
import ControlView from '../../views/control/control'
import OperationView from '../../views/operation/operation'
import useAppDispatch from '../../hooks/useAppDispatch'
import useBlueprintSelector from '../../hooks/useBlueprintSelector'
import usePointerDrag from '../../hooks/usePointerDrag'
import useUISelector from '../../hooks/useUISelector'
import { BlueprintNodeId, BlueprintNodeType } from '../../slices/blueprint/types/blueprint'
import { ControlNodeState } from '../../slices/blueprint/types/control'
import { FocusEvent, useCallback, useLayoutEffect, useRef } from 'react'
import { UICanvasMode } from '../../slices/ui/types'
import { getCanvasMode } from '../../slices/ui/selectors'
import { getNode, getNodeChildren, isSelectedNode } from '../../slices/blueprint/selectors/blueprint'
import { layoutNodeAction, moveNodeAction, selectNodeAction } from '../../slices/blueprint'
import { renderClassName } from '../../lib/utils/dom'

export default function NodeView (props: {
  nodeId: BlueprintNodeId
  contextProgramId: BlueprintNodeId
}): JSX.Element {
  const { nodeId, contextProgramId } = props

  const dispatch = useAppDispatch()

  const node = useBlueprintSelector(state => getNode(state, nodeId))
  const isSelected = useBlueprintSelector(state => isSelectedNode(state, nodeId))
  const canvasMode = useUISelector(getCanvasMode)

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
    if (node.frame !== undefined && nodeElement !== null) {
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
        node.frame.width !== width ||
        node.frame.height !== height ||
        outletPositions.length > 0
      ) {
        dispatch(layoutNodeAction({ nodeId, width, height, outletPositions }))
      }
    }
  }, [nodeRef, outletRefs, node, controls])

  const onPointerDown = usePointerDrag((state, deltaX, deltaY) => {
    dispatch(moveNodeAction({ nodeId, x: deltaX, y: deltaY }))
  })

  const onFocus = (event: FocusEvent): void => {
    event.stopPropagation()
    if (!isSelected) {
      dispatch(selectNodeAction({ nodeId }))
    }
  }

  const modifiers = isSelected ? ['selected'] : []

  return (
    <div
      ref={nodeRef}
      className={renderClassName('node', modifiers)}
      role='region'
      style={canvasMode === UICanvasMode.Plane && node.frame !== undefined
        ? { transform: `translate(${node.frame.x}px, ${node.frame.y}px)` }
        : {}}
      tabIndex={0}
      onPointerDown={canvasMode === UICanvasMode.Plane ? onPointerDown : undefined}
      onFocus={onFocus}
    >
      {(node.type === BlueprintNodeType.Operation || node.type === BlueprintNodeType.Program) && (
        <OperationView
          nodeId={nodeId}
          contextProgramId={contextProgramId}
          onOutletRef={onOutletRef}
        />
      )}
      {node.type === BlueprintNodeType.Control && (
        <ControlView
          controlId={nodeId}
          contextProgramId={contextProgramId}
          onOutletRef={onOutletRef}
        />
      )}
    </div>
  )
}
