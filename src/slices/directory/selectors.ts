
import { DirectoryState } from './types'
import { OperationExtension } from 'slices/blueprint/types/operation'

export const getOperationExtensions = (state: DirectoryState): OperationExtension[] =>
  state.operationExtensions
