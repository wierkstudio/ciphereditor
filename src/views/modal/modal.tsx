
import './modal.scss'
import { ModalState } from 'slices/ui/types'
import { ReactComponent as CloseIcon } from 'icons/close.svg'
import { MouseEvent, ReactNode, useCallback } from 'react'
import { useAppDispatch } from 'utils/hooks'
import { cancelTopModalAction } from 'slices/ui'

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
          <button className="modal__close" onClick={onCloseClick}>
            <CloseIcon />
          </button>
        </header>
      )}
      <div className="modal__content">
        {props.children}
      </div>
    </div>
  )
}
