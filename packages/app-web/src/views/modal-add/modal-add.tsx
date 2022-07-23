
import ButtonView from '../../views/button/button'
import InputTextView from '../input-text/input-text'
import ModalView, { ModalViewAction } from '../../views/modal/modal'
import useAppDispatch from '../../hooks/useAppDispatch'
import useAppSelector from '../../hooks/useAppSelector'
import useBlueprintSelector from '../../hooks/useBlueprintSelector'
import useTranslation from '../../hooks/useTranslation'
import { AddModalPayload } from '../../slices/ui/types'
import { addControlAction, addEmptyProgramAction, addOperationAction } from '../../slices/blueprint'
import { capitalCase } from 'change-case'
import { getActiveProgram } from '../../slices/blueprint/selectors/program'
import { getCanvasOffset, getCanvasSize } from '../../slices/ui/selectors'
import { getContributions } from '../../slices/directory/selectors'
import { gridSize } from '../../hooks/useDragMove'
import { openUrlAction, popModalAction } from '../../slices/ui'
import { useState } from 'react'

export default function AddModalView (props: AddModalPayload): JSX.Element {
  const dispatch = useAppDispatch()
  const [t] = useTranslation()
  const activeProgram = useBlueprintSelector(state => getActiveProgram(state))
  const contributions = useAppSelector(state => getContributions(state.directory))
  const canvasSize = useAppSelector(state => getCanvasSize(state.ui))
  const canvasOffset = useAppSelector(state => getCanvasOffset(state.ui))

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
              onClick={() => {
                // TODO: Remove magic numbers
                activeProgram !== undefined && dispatch(addOperationAction({
                  programId: activeProgram.id,
                  contribution,
                  x: Math.round((canvasOffset.x + canvasSize.width * 0.5 - 320 * 0.5) / gridSize) * gridSize,
                  y: Math.round((canvasOffset.y + canvasSize.height * 0.5 - 80) / gridSize) * gridSize
                }))
                dispatch(popModalAction({}))
              }}
            >
              {/* TODO: Needs translation */}
              {contribution.label ?? capitalCase(contribution.name)}
            </ButtonView>
          </li>
        ))}
        <li key='empty-operation'>
          <ButtonView
            onClick={() => {
              activeProgram !== undefined && dispatch(addEmptyProgramAction({
                programId: activeProgram.id,
                x: Math.round((canvasOffset.x + canvasSize.width * 0.5) / gridSize) * gridSize,
                y: Math.round((canvasOffset.y + canvasSize.height * 0.5) / gridSize) * gridSize
              }))
              dispatch(popModalAction({}))
            }}
          >
            {t('New program')}
          </ButtonView>
        </li>
        <li key='empty-control'>
          <ButtonView
            onClick={() => {
              activeProgram !== undefined && dispatch(addControlAction({
                programId: activeProgram.id,
                x: Math.round((canvasOffset.x + canvasSize.width * 0.5 - 320 * 0.5) / gridSize) * gridSize,
                y: Math.round((canvasOffset.y + canvasSize.height * 0.5 - 64 * 0.5) / gridSize) * gridSize
              }))
              dispatch(popModalAction({}))
            }}
          >
            {t('Empty control')}
          </ButtonView>
        </li>
      </ul>
    </ModalView>
  )
}
