
import { BlueprintNodeId, BlueprintState } from 'types/blueprint'
import { getControlNode } from '../selectors/control'

export const linkControls = (
  state: BlueprintState,
  sourceControlId: BlueprintNodeId,
  targetControlId: BlueprintNodeId
) => {
  const sourceControl = getControlNode(state, sourceControlId)
  const targetControl = getControlNode(state, targetControlId)

  // Prevent linking controls from the same parent
  if (sourceControl.parentId === targetControl.parentId) {
    return
  }

  // TODO: Handle the following scenarios
  // 1. None of them are attached to any variable
  // 2. Source is attached to a variable and target is not
  // 3. Source is not attached to a variable but target is
  // 4. Both controls are attached to a variable
  console.log(`link control #${sourceControlId} and #${targetControlId}`)
}
