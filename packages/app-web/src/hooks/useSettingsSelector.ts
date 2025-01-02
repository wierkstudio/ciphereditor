
import useAppSelector from './useAppSelector'
import { SettingsState } from '../slices/settings/types'
import { TypedUseSelectorHook } from 'react-redux'

/**
 * A hook to access the settings state. This hook takes a settings selector
 * function as an argument.
 */
const useSettingsSelector: TypedUseSelectorHook<SettingsState> =
  (selector, options) =>
    useAppSelector(state => selector(state.settings), options)

export default useSettingsSelector
