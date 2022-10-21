
import ButtonView from '../button/button'
import ModalView from '../../views/modal/modal'
import useBlueprintSelector from '../../hooks/useBlueprintSelector'
import useDirectorySelector from '../../hooks/useDirectorySelector'
import useTranslation from '../../hooks/useTranslation'
import { SettingsModalPayload } from '../../slices/ui/types'
import { bufferToBase64urlString, stringToBuffer } from '@ciphereditor/library'
import { serializeBlueprint } from '../../slices/blueprint/selectors/blueprint'

export default function ShareModalView (props: SettingsModalPayload): JSX.Element {
  const [t] = useTranslation()

  const directory = useDirectorySelector(state => state)
  const serializedBlueprint = useBlueprintSelector(state => serializeBlueprint(state, directory))

  const documentText = JSON.stringify(serializedBlueprint)

  const onCopyShareUrl = (): void => {
    const documentFragment = bufferToBase64urlString(stringToBuffer(documentText))
    const url = location.href + '#blueprint=' + documentFragment
    void navigator.clipboard.writeText(url)
  }

  const onDownloadBlueprint = (): void => {
    // Initiate download via anchor element
    const documentBlob = URL.createObjectURL(new Blob(
      [documentText],
      { type: 'application/vnd.ciphereditor.blueprint' }
    ))
    const anchorElement = document.createElement('a')
    anchorElement.download = 'Blueprint.ciphereditor'
    anchorElement.href = documentBlob
    document.body.appendChild(anchorElement)
    anchorElement.click()
    document.body.removeChild(anchorElement)
  }

  return (
    <ModalView title={t('Share your blueprint')}>
      <ModalView.SectionView headline={t('Share via link')}>
        <ButtonView icon='copy' onClick={onCopyShareUrl}>
          {t('Copy link')}
        </ButtonView>
      </ModalView.SectionView>
      <ModalView.SectionView headline={t('Save as a file')}>
        <ButtonView icon='arrowUp' onClick={onDownloadBlueprint}>
          {t('Download blueprint')}
        </ButtonView>
      </ModalView.SectionView>
    </ModalView>
  )
}
