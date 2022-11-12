
import IssueListView from '../issue-list/issue-list'
import ModalView, { ModalViewAction } from '../../views/modal/modal'
import useAppDispatch from '../../hooks/useAppDispatch'
import useBlueprintSelector from '../../hooks/useBlueprintSelector'
import useDirectorySelector from '../../hooks/useDirectorySelector'
import useTranslation from '../../hooks/useTranslation'
import { BlueprintNodeType } from '../../slices/blueprint/types/blueprint'
import { OperationContribution } from '@ciphereditor/library'
import { OperationModalPayload } from '../../slices/ui/types'
import { OperationNodeState } from '../../slices/blueprint/types/operation'
import { deleteAction, duplicateAction } from '../../slices/blueprint'
import { getNode } from '../../slices/blueprint/selectors/blueprint'
import { getOperationContribution } from '../../slices/directory/selectors'
import { getOperationIssues } from '../../slices/blueprint/selectors/operation'
import { openUrlAction, popModalAction } from '../../slices/ui'

export default function OperationModalView (props: OperationModalPayload): JSX.Element {
  const dispatch = useAppDispatch()
  const nodeId = props.nodeId
  const node = useBlueprintSelector(state => getNode(state, nodeId))
  const [t] = useTranslation()
  const issues = useBlueprintSelector(state => getOperationIssues(state, nodeId))

  let title = t('Configure your program')
  let description: string | undefined = t(
    'A program consists of one or more operations and controls bundled ' +
    'together as a custom operation.'
  )
  let contribution: OperationContribution | undefined
  if (node.type === BlueprintNodeType.Operation) {
    const operation = node as OperationNodeState
    // TODO: Needs translation
    title = `Configure ${operation.label}`
    contribution = useDirectorySelector(state => getOperationContribution(state, operation.name))
    description = contribution?.description
  }

  const actions: ModalViewAction[] = []

  // Help action
  if (contribution?.url !== undefined) {
    const url = contribution?.url
    actions.push({
      title: t('Help'),
      icon: 'help',
      onClick: (): void => {
        dispatch(openUrlAction({ url }))
      }
    })
  }

  // Duplicate action
  actions.push({
    title: t('Duplicate node'),
    icon: 'copy',
    onClick: (): void => {
      dispatch(popModalAction({}))
      dispatch(duplicateAction({ nodeIds: [nodeId] }))
    }
  })

  // Remove action
  actions.push({
    title: t('Remove node'),
    icon: 'trash',
    onClick: (): void => {
      dispatch(popModalAction({}))
      dispatch(deleteAction({ nodeIds: [nodeId] }))
    }
  })

  return (
    <ModalView title={title} actions={actions}>
      <ModalView.SectionView headline={t('Description')}>
        {description}
      </ModalView.SectionView>
      {issues.length > 0 && (
        <ModalView.SectionView headline={t('Pending issues')}>
          <IssueListView issues={issues} />
        </ModalView.SectionView>
      )}
    </ModalView>
  )
}
