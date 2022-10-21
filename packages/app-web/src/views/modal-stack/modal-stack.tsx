
import './modal-stack.scss'
import AddModalView from '../../views/modal-add/modal-add'
import OperationModalView from '../modal-operation/modal-operation'
import ReportModalView from '../../views/modal-report/modal-report'
import SettingsModalView from '../../views/modal-settings/modal-settings'
import ShareModalView from '../modal-share/modal-share'
import useAppDispatch from '../../hooks/useAppDispatch'
import useAppSelector from '../../hooks/useAppSelector'
import { MouseEvent, useCallback } from 'react'
import { getModalStack } from '../../slices/ui/selectors'
import { popModalAction } from '../../slices/ui'

const modalViewMap = {
  add: AddModalView,
  operation: OperationModalView,
  report: ReportModalView,
  settings: SettingsModalView,
  share: ShareModalView
}

export default function ModalStackView (): JSX.Element {
  const dispatch = useAppDispatch()
  const modals = useAppSelector(state => getModalStack(state.ui))

  const onBackdropClick = useCallback((event: MouseEvent) => {
    dispatch(popModalAction({}))
  }, [dispatch])

  if (modals.length === 0) {
    return <></>
  }

  return (
    <div className='modal-stack'>
      {modals.map((payload, index) => {
        const ModalView = modalViewMap[payload.type]
        return (
          <div
            className='modal-stack__layer'
            role='dialog'
            aria-modal
            tabIndex={-1}
            key={index}
          >
            <div className='modal-stack__backdrop' onClick={onBackdropClick} />
            <div className='modal-stack__modal'>
              <ModalView {...(payload as any)} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
