
import './node.scss'
import ControlView from 'views/control/control'
import OperationView from 'views/operation/operation'
import useAppDispatch from 'hooks/useAppDispatch'
import useBlueprintSelector from 'hooks/useBlueprintSelector'
import useClassName from 'hooks/useClassName'
import { BlueprintNodeId, BlueprintNodeType } from 'slices/blueprint/types/blueprint'
import { ControlNode } from 'slices/blueprint/types/control'
import { getNode, getNodeChildren, isSelectedNode } from 'slices/blueprint/selectors/blueprint'
import { layoutNodeAction, selectNodeAction } from 'slices/blueprint'
import { useCallback, useLayoutEffect, useRef } from 'react'

export default function NodeView (props: {
  nodeId: BlueprintNodeId
  contextProgramId: BlueprintNodeId
}): JSX.Element {
  const { nodeId, contextProgramId } = props

  const dispatch = useAppDispatch()

  const node = useBlueprintSelector(state => getNode(state, nodeId))
  const isSelected = useBlueprintSelector(state => isSelectedNode(state, nodeId))

  const controls = useBlueprintSelector(state => {
    const controlNodes =
      node.type === BlueprintNodeType.Control
        ? [node as ControlNode]
        : getNodeChildren(state, node.id, BlueprintNodeType.Control) as ControlNode[]
    return controlNodes.map(control => ({
      id: control.id,
      nodeOutletX: control.nodeOutletX,
      nodeOutletY: control.nodeOutletY
    }))
  })

  const nodeRef = useRef<HTMLDivElement>(null)
  const outletRefs = useRef<{ [controlId: string]: HTMLButtonElement | null }>({})
  const onOutletRef = useCallback((controlId: number, element: HTMLButtonElement | null) => {
    if (element !== null) {
      outletRefs.current[controlId] = element
    } else {
      outletRefs.current[controlId] = null
    }
  }, [outletRefs])

  useLayoutEffect(() => {
    // TODO: Optimization: Measuring things is expensive, this should only be
    // run when actual changes are applied to the DOM
    // TODO: Optimization: This should NOT be called when the node gets moved
    const nodeElement = nodeRef.current
    if (nodeElement !== null) {
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
        if (indicatorElement !== null) {
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

      if (node.width !== width || node.height !== height || outletPositions.length > 0) {
        dispatch(layoutNodeAction({ nodeId, width, height, outletPositions }))
      }
    }
  })

  const modifiers = isSelected ? ['selected'] : []

  return (
    <div
      className={useClassName('node', modifiers)}
      role='region'
      ref={nodeRef}
      tabIndex={0}
      onFocus={() => dispatch(selectNodeAction({ nodeId }))}
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
