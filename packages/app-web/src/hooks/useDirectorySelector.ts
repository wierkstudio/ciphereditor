
import useAppSelector from './useAppSelector'
import { TypedUseSelectorHook } from 'react-redux'
import { DirectoryState } from '../slices/directory/types'

/**
 * A hook to access the directory state. This hook takes a directory selector
 * function as an argument.
 */
const useDirectorySelector: TypedUseSelectorHook<DirectoryState> = <TSelected = unknown>(
  selector: (state: DirectoryState) => TSelected,
  equalityFn?: (left: TSelected, right: TSelected) => boolean
) => useAppSelector(state => selector(state.directory), equalityFn)

export default useDirectorySelector
