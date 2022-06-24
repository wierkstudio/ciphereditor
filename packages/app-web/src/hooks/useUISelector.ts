
import useAppSelector from './useAppSelector'
import { TypedUseSelectorHook } from 'react-redux'
import { UIState } from '../slices/ui/types'

/**
 * A hook to access the UI state. This hook takes a UI selector function as an
 * argument.
 */
const useUISelector: TypedUseSelectorHook<UIState> = <TSelected = unknown>(
  selector: (state: UIState) => TSelected,
  equalityFn?: (left: TSelected, right: TSelected) => boolean
) => useAppSelector(state => selector(state.ui), equalityFn)

export default useUISelector
