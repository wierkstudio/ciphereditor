
import './modal-report.scss'
import ModalView from '../../views/modal/modal'
import { ReportModalState } from '../../slices/ui/types'

export default function ReportModalView (props: {
  modal: ReportModalState
}): JSX.Element {
  return (
    <ModalView modal={props.modal} title={props.modal.title}>
      <p>{props.modal.description}</p>
    </ModalView>
  )
}
