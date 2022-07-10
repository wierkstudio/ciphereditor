
import ModalView from '../../views/modal/modal'
import useBlueprintSelector from '../../hooks/useBlueprintSelector'
import useDirectorySelector from '../../hooks/useDirectorySelector'
import { BlueprintNodeType } from '../../slices/blueprint/types/blueprint'
import { OperationContribution } from '@ciphereditor/types'
import { OperationModalPayload } from '../../slices/ui/types'
import { OperationNode } from '../../slices/blueprint/types/operation'
import { getNode } from '../../slices/blueprint/selectors/blueprint'
import { getOperationContribution } from '../../slices/directory/selectors'

export default function OperationModalView (props: OperationModalPayload): JSX.Element {
  const node = useBlueprintSelector(state => getNode(state, props.nodeId))

  let title = 'Configure your program'
  let description: string | undefined =
    'A program consists of one or more operations and controls bundled together as a custom operation.'
  let contribution: OperationContribution | undefined
  if (node.type === BlueprintNodeType.Operation) {
    const operation = node as OperationNode
    title = `Configure ${operation.label}`
    contribution = useDirectorySelector(state => getOperationContribution(state, operation.contributionName))
    description = contribution?.description
  }

  return (
    <ModalView payload={props} title={title}>
      <ModalView.SectionView headline='Description'>
        {description}
      </ModalView.SectionView>
    </ModalView>
  )
}
