
import ModalView from '../../views/modal/modal'
import SelectView from '../../views/select/select'
import useAppDispatch from '../../hooks/useAppDispatch'
import useSettingsSelector from '../../hooks/useSettingsSelector'
import useTranslation from '../../hooks/useTranslation'
import { ReducedMotionPreferenceOption, ThemeOption } from '../../slices/settings/types'
import { SettingsModalPayload } from '../../slices/ui/types'
import { applyReducedMotionPreference, applyTheme } from '../../slices/settings'
import { getAccessibilitySettings } from '../../slices/settings/selectors'

export default function SettingsModalView (props: SettingsModalPayload): JSX.Element {
  const dispatch = useAppDispatch()
  const [t] = useTranslation()
  const accessibilitySettings = useSettingsSelector(getAccessibilitySettings)

  return (
    <ModalView title={t('Settings')}>
      <ModalView.SectionView headline={t('Theme')}>
        <SelectView
          elements={[
            { type: 'option', value: 'system', label: t('System default') },
            { type: 'option', value: 'light', label: t('Light theme') },
            { type: 'option', value: 'dark', label: t('Dark theme') }
          ]}
          value={accessibilitySettings.theme}
          onChange={event => dispatch(applyTheme({
            theme: event.currentTarget.value as ThemeOption
          }))}
        />
      </ModalView.SectionView>
      <ModalView.SectionView headline={t('Reduced motion')}>
        <SelectView
          elements={[
            { type: 'option', value: 'system', label: t('System default') },
            { type: 'option', value: 'reduce', label: t('Reduce motion') }
          ]}
          value={accessibilitySettings.reducedMotionPreference}
          onChange={event => dispatch(applyReducedMotionPreference({
            reducedMotionPreference: event.currentTarget.value as ReducedMotionPreferenceOption
          }))}
        />
      </ModalView.SectionView>
      <ModalView.SectionView headline='Scaling'>
        <p>{t('This app scales according to your Browser settings for zoom and text size.')}</p>
      </ModalView.SectionView>
      <ModalView.SectionView headline='About this app'>
        <p>ciphereditor</p>
        <p>Copyright (c) 2023 Fränz Friederes, Wierk S.à r.l.</p>
      </ModalView.SectionView>
    </ModalView>
  )
}
