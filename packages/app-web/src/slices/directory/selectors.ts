
import { Contribution } from '@cryptii/types'
import { DirectoryState } from './types'

export const getContributions = (state: DirectoryState): Contribution[] =>
  state.contributions
