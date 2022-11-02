
import ButtonView from '../../views/button/button'
import InputTextView from '../input-text/input-text'
import ModalView, { ModalViewAction } from '../../views/modal/modal'
import useAppDispatch from '../../hooks/useAppDispatch'
import useAppSelector from '../../hooks/useAppSelector'
import useTranslation from '../../hooks/useTranslation'
import { AddModalPayload } from '../../slices/ui/types'
import { BlueprintNode, createEmptyValue, serializeValue } from '@ciphereditor/library'
import { addNodesAction } from '../../slices/blueprint'
import { capitalCase } from 'change-case'
import { getContributions } from '../../slices/directory/selectors'
import { openUrlAction, popModalAction } from '../../slices/ui'
import { useState } from 'react'

export default function AddModalView (props: AddModalPayload): JSX.Element {
  const dispatch = useAppDispatch()
  const [t] = useTranslation()
  const contributions = useAppSelector(state => getContributions(state.directory))

  const [searchQuery, setSearchQuery] = useState('')
  const searchKeywords = searchQuery.toLowerCase().split(/\s+/g)

  // Filter contributions by keywords
  // TODO: Optimize search by building up an index
  const matchingContributions = contributions.filter(contribution => {
    const contributionText =
      (contribution.keywords?.join(', ').toLowerCase() ?? '') + ' ' +
      (contribution.label?.toLowerCase() ?? '') + ' ' +
      (contribution.description?.toLowerCase() ?? '')
    for (const searchKeyword of searchKeywords) {
      if (!contributionText.includes(searchKeyword)) {
        return false
      }
    }
    return true
  })

  const helpAction: ModalViewAction = {
    title: t('Help'),
    icon: 'help',
    onClick: (event) => {
      dispatch(openUrlAction({
        url: 'https://ciphereditor.com/operations'
      }))
    }
  }

  const addNode = (node: BlueprintNode): void => {
    dispatch(addNodesAction({ nodes: [node] }))
    dispatch(popModalAction({}))
  }

  return (
    <ModalView
      title={t('Add a new operation')}
      actions={[helpAction]}
    >
      <InputTextView
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder={t('Search')}
        leadingIcon='search'
        autoFocus
      />
      <ul>
        {matchingContributions.map(contribution => (
          <li key={contribution.name}>
            <ButtonView
              onClick={() => addNode({
                type: 'operation',
                name: contribution.name
              })}
            >
              {/* TODO: Needs translation */}
              {contribution.label ?? capitalCase(contribution.name)}
            </ButtonView>
          </li>
        ))}
        <li key='empty-operation'>
          <ButtonView onClick={() => addNode({ type: 'program' })}>
            {t('New program')}
          </ButtonView>
        </li>
        <li key='empty-control'>
          <ButtonView
            onClick={() => {
              const emptyValue = serializeValue(createEmptyValue('text'))
              addNode({ type: 'control', value: emptyValue })
            }}
          >
            {t('Empty control')}
          </ButtonView>
        </li>
      </ul>
    </ModalView>
  )
}
