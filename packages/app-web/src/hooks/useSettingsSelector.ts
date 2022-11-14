
import useAppSelector from './useAppSelector'
import { EqualityFn, NoInfer, TypedUseSelectorHook } from 'react-redux'
import { SettingsState } from '../slices/settings/types'

/**
 * A hook to access the settings state. This hook takes a settings selector
 * function as an argument.
 */
const useSettingsSelector: TypedUseSelectorHook<SettingsState> = <TSelected = unknown>(
  selector: (state: SettingsState) => TSelected,
  equalityFn?: EqualityFn<NoInfer<TSelected>> | undefined
) => useAppSelector(state => selector(state.settings), equalityFn)

export default useSettingsSelector
