
import useAppSelector from './useAppSelector'
import { DirectoryState } from '../slices/directory/types'
import { EqualityFn, NoInfer, TypedUseSelectorHook } from 'react-redux'

/**
 * A hook to access the directory state. This hook takes a directory selector
 * function as an argument.
 */
const useDirectorySelector: TypedUseSelectorHook<DirectoryState> = <TSelected = unknown>(
  selector: (state: DirectoryState) => TSelected,
  equalityFn?: EqualityFn<NoInfer<TSelected>> | undefined
) => useAppSelector(state => selector(state.directory), equalityFn)

export default useDirectorySelector
