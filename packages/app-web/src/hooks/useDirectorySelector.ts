
import useAppSelector from './useAppSelector'
import { DirectoryState } from '../slices/directory/types'
import { TypedUseSelectorHook } from 'react-redux'

/**
 * A hook to access the directory state. This hook takes a directory selector
 * function as an argument.
 */
const useDirectorySelector: TypedUseSelectorHook<DirectoryState> =
  (selector, options) =>
    useAppSelector(state => selector(state.directory), options)

export default useDirectorySelector
