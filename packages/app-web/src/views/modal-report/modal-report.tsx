
import ModalView from '../../views/modal/modal'
import { ReportModalPayload } from '../../slices/ui/types'

export default function ReportModalView (props: ReportModalPayload): JSX.Element {
  return (
    <ModalView title={props.title}>
      <p>{props.description}</p>
    </ModalView>
  )
}
