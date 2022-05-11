
import useAppSelector from './useAppSelector'
import { SettingsState } from 'slices/settings/types'
import { TypedUseSelectorHook } from 'react-redux'

/**
 * A hook to access the settings state. This hook takes a settings selector
 * function as an argument.
 */
const useSettingsSelector: TypedUseSelectorHook<SettingsState> = <TSelected = unknown>(
  selector: (state: SettingsState) => TSelected,
  equalityFn?: (left: TSelected, right: TSelected) => boolean
) => useAppSelector(state => selector(state.settings), equalityFn)

export default useSettingsSelector
