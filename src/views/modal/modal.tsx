
import './modal.scss'
import useAppDispatch from 'hooks/useAppDispatch'
import { ModalState } from 'slices/ui/types'
import { MouseEvent, ReactNode, useCallback } from 'react'
import { cancelTopModalAction } from 'slices/ui'
import ButtonView from 'views/button/button'

export default function ModalView(props: {
  modal: ModalState,
  title?: string,
  children: ReactNode
}) {
  const dispatch = useAppDispatch()

  const onCloseClick = useCallback((event: MouseEvent) => {
    dispatch(cancelTopModalAction({}))
  }, [dispatch])

  return (
    <div className="modal">
      {props.title && (
        <header className="modal__header">
          <h2 className="modal__title">{props.title}</h2>
          <div className="modal__btn-close">
            <ButtonView icon="close" modifiers="large" onClick={onCloseClick} />
          </div>
        </header>
      )}
      <div className="modal__content">
        {props.children}
      </div>
    </div>
  )
}
