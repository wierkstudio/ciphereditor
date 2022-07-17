
import ModalView from '../../views/modal/modal'
import useBlueprintSelector from '../../hooks/useBlueprintSelector'
import useDirectorySelector from '../../hooks/useDirectorySelector'
import useTranslation from '../../hooks/useTranslation'
import { BlueprintNodeType } from '../../slices/blueprint/types/blueprint'
import { OperationContribution } from '@ciphereditor/types'
import { OperationModalPayload } from '../../slices/ui/types'
import { OperationNode } from '../../slices/blueprint/types/operation'
import { getNode } from '../../slices/blueprint/selectors/blueprint'
import { getOperationContribution } from '../../slices/directory/selectors'
import useAppDispatch from '../../hooks/useAppDispatch'
import { removeNodeAction } from '../../slices/blueprint'
import { popModalAction } from '../../slices/ui'

export default function OperationModalView (props: OperationModalPayload): JSX.Element {
  const dispatch = useAppDispatch()
  const nodeId = props.nodeId
  const node = useBlueprintSelector(state => getNode(state, nodeId))
  const [t] = useTranslation()

  let title = t('Configure your program')
  let description: string | undefined = t(
    'A program consists of one or more operations and controls bundled ' +
    'together as a custom operation.'
  )
  let contribution: OperationContribution | undefined
  if (node.type === BlueprintNodeType.Operation) {
    const operation = node as OperationNode
    // TODO: Needs translation
    title = `Configure ${operation.label}`
    contribution = useDirectorySelector(state => getOperationContribution(state, operation.contributionName))
    description = contribution?.description
  }

  const onRemove = (): void => {
    dispatch(popModalAction({}))
    dispatch(removeNodeAction({ nodeId }))
  }

  return (
    <ModalView
      title={title}
      actions={[
        { title: t('Remove node'), icon: 'trash', onClick: onRemove }
      ]}
    >
      <ModalView.SectionView headline={t('Description')}>
        {description}
      </ModalView.SectionView>
    </ModalView>
  )
}
