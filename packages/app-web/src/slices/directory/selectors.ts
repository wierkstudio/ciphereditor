
import { Contribution } from '@ciphereditor/types'
import { DirectoryState } from './types'

export const getContributions = (state: DirectoryState): Contribution[] =>
  state.contributions
