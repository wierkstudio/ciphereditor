
import { Contribution, OperationContribution } from '@ciphereditor/types'
import { DirectoryState } from './types'

export const getContributions = (state: DirectoryState): Contribution[] =>
  state.contributions

export const getOperationContribution = (state: DirectoryState, name: string): OperationContribution | undefined =>
  state.contributions.find(contribution => contribution.name === name && contribution.type === 'operation')
