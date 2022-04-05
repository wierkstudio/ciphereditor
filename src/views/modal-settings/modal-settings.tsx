
import './modal-settings.scss'
import ModalView from 'views/modal/modal'
import SelectView from 'views/select/select'
import useAppDispatch from 'hooks/useAppDispatch'
import useAppSelector from 'hooks/useAppSelector'
import { ModalState } from 'slices/ui/types'
import { ReducedMotionPreferenceOption, ScalingOption, ThemeOption } from 'slices/settings/types'
import { applyReducedMotionPreference, applyScaling, applyTheme } from 'slices/settings'
import { getReducedMotionPreference, getScaling, getTheme } from 'slices/settings/selectors'

export default function SettingsModalView (props: {
  modal: ModalState
}): JSX.Element {
  const dispatch = useAppDispatch()
  const theme = useAppSelector(state => getTheme(state.settings))
  const scaling = useAppSelector(state => getScaling(state.settings))
  const reducedMotionPreference = useAppSelector(state => getReducedMotionPreference(state.settings))
  return (
    <ModalView modal={props.modal} title='Settings'>
      <div>
        Theme setting:
        <SelectView
          elements={[
            { type: 'option', value: ThemeOption.SystemDefault, label: 'System default' },
            { type: 'option', value: ThemeOption.Light, label: 'Light' },
            { type: 'option', value: ThemeOption.Dark, label: 'Dark' }
          ]}
          value={theme}
          onChange={event => dispatch(applyTheme({
            theme: event.currentTarget.value as ThemeOption
          }))}
        />
      </div>
      <div>
        Scaling:
        <SelectView
          elements={[
            { type: 'option', value: ScalingOption.SystemDefault, label: 'System default' },
            { type: 'option', value: ScalingOption.Normal, label: 'Normal' },
            { type: 'option', value: ScalingOption.Large, label: 'Large' },
            { type: 'option', value: ScalingOption.Huge, label: 'Huge' }
          ]}
          value={scaling}
          onChange={event => dispatch(applyScaling({
            scaling: event.currentTarget.value as ScalingOption
          }))}
        />
      </div>
      <div>
        Reduced motion:
        <SelectView
          elements={[
            { type: 'option', value: ReducedMotionPreferenceOption.SystemDefault, label: 'System default' },
            { type: 'option', value: ReducedMotionPreferenceOption.Reduce, label: 'Reduce' }
          ]}
          value={reducedMotionPreference}
          onChange={event => dispatch(applyReducedMotionPreference({
            reducedMotionPreference: event.currentTarget.value as ReducedMotionPreferenceOption
          }))}
        />
      </div>
    </ModalView>
  )
}
