
import './modal.scss'
import ButtonView from '../../views/button/button'
import useAppDispatch from '../../hooks/useAppDispatch'
import useSettingsSelector from '../../hooks/useSettingsSelector'
import useTranslation from '../../hooks/useTranslation'
import { Icon } from '../icon/icon'
import { MouseEvent, MouseEventHandler, ReactNode, useCallback } from 'react'
import { getKeyCombination } from '../../slices/settings/selectors'
import { popModalAction } from '../../slices/ui'

export interface ModalViewAction {
  title: string
  icon: Icon
  keyCombination?: string
  onClick: MouseEventHandler<HTMLButtonElement>
}

export default function ModalView (props: {
  title?: string
  actions?: ModalViewAction[]
  children: ReactNode
}): JSX.Element {
  const dispatch = useAppDispatch()
  const [t] = useTranslation()

  const onCloseClick = useCallback((event: MouseEvent) => {
    dispatch(popModalAction({}))
  }, [dispatch])

  const closeModalKeyCombination = useSettingsSelector(state =>
    getKeyCombination(state, 'closeModal'))

  return (
    <div className='modal'>
      <header className='modal__header'>
        <h2 className='modal__title'>{props.title}</h2>
        <div className='modal__actions'>
          {props.actions?.map(action => (
            <ButtonView
              key={action.title}
              modifiers='large'
              {...action}
            />
          ))}
          <ButtonView
            title={t('Close')}
            icon='close'
            modifiers='large'
            keyCombination={closeModalKeyCombination}
            onClick={onCloseClick}
          />
        </div>
      </header>
      <div className='modal__content'>
        {props.children}
      </div>
      <footer className='modal__footer' />
    </div>
  )
}

ModalView.SectionView = (props: {
  headline: string
  children: React.ReactNode
}): JSX.Element => {
  return (
    <fieldset className='modal__section'>
      <legend className='modal__section-headline'>{props.headline}</legend>
      <div className='modal__section-content'>
        {props.children}
      </div>
    </fieldset>
  )
}
