
import ButtonView from '../button/button'
import ModalView from '../../views/modal/modal'
import useBlueprintSelector from '../../hooks/useBlueprintSelector'
import useDirectorySelector from '../../hooks/useDirectorySelector'
import useTranslation from '../../hooks/useTranslation'
import useUISelector from '../../hooks/useUISelector'
import { SettingsModalPayload } from '../../slices/ui/types'
import { bufferToBase64urlString, stringToBuffer } from '@ciphereditor/library'
import { serializeBlueprint } from '../../slices/blueprint/selectors/blueprint'
import { trackEvent } from '../../lib/embed'

export default function ShareModalView (props: SettingsModalPayload): JSX.Element {
  const [t] = useTranslation()

  const directory = useDirectorySelector(state => state)
  const serializedBlueprint = useBlueprintSelector(state => serializeBlueprint(state, directory))

  const shareBaseUrl = useUISelector(state => state.shareBaseUrl)

  const documentText = JSON.stringify(serializedBlueprint)

  const onShareViaLink = (): void => {
    const blueprintParameter = bufferToBase64urlString(stringToBuffer(documentText))
    const url = shareBaseUrl + '#blueprint=' + blueprintParameter
    void navigator.clipboard.writeText(url)
    trackEvent('shareViaLink')
  }

  const onSave = (): void => {
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
    trackEvent('save')
  }

  return (
    <ModalView title={t('Share your blueprint')}>
      <ModalView.SectionView headline={t('Share via link')}>
        <ButtonView icon='copy' onClick={onShareViaLink}>
          {t('Copy link')}
        </ButtonView>
      </ModalView.SectionView>
      <ModalView.SectionView headline={t('Save as a file')}>
        <ButtonView icon='save' onClick={onSave}>
          {t('Save blueprint')}
        </ButtonView>
        <p>{t('You may load a blueprint by dragging and dropping the file on the canvas.')}</p>
      </ModalView.SectionView>
    </ModalView>
  )
}
