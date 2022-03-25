
import './operation.scss'
import ControlView from 'views/control/control'
import IconView from 'views/icon/icon'
import useAppDispatch from 'hooks/useAppDispatch'
import useBlueprintSelector from 'hooks/useBlueprintSelector'
import { BlueprintNodeId, BlueprintNodeType } from 'slices/blueprint/types/blueprint'
import { ControlNode } from 'slices/blueprint/types/control'
import { OperationNode } from 'slices/blueprint/types/operation'
import { ProgramNode } from 'slices/blueprint/types/program'
import { enterProgramAction, layoutNodeAction, selectNodeAction } from 'slices/blueprint'
import { getNode, getNodeChildren } from 'slices/blueprint/selectors/blueprint'
import { useCallback, useLayoutEffect, useRef } from 'react'

export default function OperationView(props: {
  /**
   * Operation or program node id
   */
  nodeId: BlueprintNodeId
  contextProgramId: BlueprintNodeId
}) {
  const { nodeId, contextProgramId } = props

  const dispatch = useAppDispatch()
  const operationRef = useRef<HTMLDivElement>(null)
  const outletRefs = useRef<{ [controlId: string]: HTMLButtonElement | null }>({})

  const node = useBlueprintSelector(state =>
    getNode(state, nodeId) as ProgramNode | OperationNode)
  const controls = useBlueprintSelector(state =>
    (getNodeChildren(state, nodeId, BlueprintNodeType.Control) as ControlNode[])
      .map((control) => ({
        id: control.id,
        operationOutletX: control.operationOutletX,
        operationOutletY: control.operationOutletY,
       })))

  let doubleClickHandler = undefined
  if (node.type === BlueprintNodeType.Program) {
    doubleClickHandler = () => {
      dispatch(enterProgramAction({ programId: nodeId }))
    }
  }

  const outletRefHandler = useCallback((controlId, element: HTMLButtonElement) => {
    // TODO: What happens to removed indicators?
    outletRefs.current[controlId] = element
  }, [outletRefs])

  useLayoutEffect(() => {
    // TODO: Optimization: Measuring things is expensive, this should only be
    // run when actual changes are applied to the DOM
    // TODO: Optimization: This should NOT be called when the node gets moved
    const operationElement = operationRef.current
    if (operationElement) {
      const outletPositions: {
        controlId: BlueprintNodeId,
        x: number | undefined,
        y: number | undefined,
      }[] = []

      const operationRect = operationElement.getBoundingClientRect()
      const width = operationRect.width
      const height = operationRect.height

      for (let i = 0; i < controls.length; i++) {
        const control = controls[i]
        let x: number | undefined = undefined
        let y: number | undefined = undefined

        // Retrieve indicator element for this control
        const indicatorElement = outletRefs.current[control.id.toString()]
        if (indicatorElement) {
          // Measure indicator rect and calculate its relative position within
          // the operation node component
          const rect = indicatorElement.getBoundingClientRect()
          x = Math.round(rect.x + rect.width * 0.5 - operationRect.x)
          y = Math.round(rect.y + rect.height * 0.5 - operationRect.y)
        }

        // Return only indicator positions that changed
        if (control.operationOutletX !== x || control.operationOutletY !== y) {
          outletPositions.push({ controlId: control.id, x, y })
        }
      }

      if (node.width !== width || node.height !== height || outletPositions.length > 0) {
        dispatch(layoutNodeAction({ nodeId, width, height, outletPositions }))
      }
    }
  })

  // TODO: Right now, we assume that the last control conveys the 'result' of
  // the operation. Therefore we show the operation header above it. From a
  // semantic perspective the header contains the headline for the entire
  // operation and thus, it appears first in the DOM.

  return (
    <div
      className="operation"
      ref={operationRef}
      role="region"
      tabIndex={0}
      onFocus={() => dispatch(selectNodeAction({ nodeId }))}
      onDoubleClick={doubleClickHandler}
    >
      <header
        className="operation__header"
        style={{ order: controls.length - 1 }}
      >
        <span className="operation__icon">
          <IconView icon="switch" />
        </span>
        <h3 className="operation__label">
          {node.label}
        </h3>
      </header>
      {controls.map(({ id }, index) => (
        <div
          key={id}
          className="operation__control"
          style={{ order: index }}
        >
          <ControlView
            controlId={id}
            contextProgramId={contextProgramId}
            outletRef={outletRefHandler.bind(null, id)}
          />
        </div>
      ))}
    </div>
  )
}
