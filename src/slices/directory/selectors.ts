
import { Operation } from 'slices/blueprint/types/operation'
import { DirectoryState } from './types'

export const getOperations = (state: DirectoryState): Operation[] =>
  state.operations
