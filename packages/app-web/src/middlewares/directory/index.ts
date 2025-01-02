
import {
  addNodesAction,
  copyAction,
  cutAction,
  duplicateAction,
  loadBlueprintAction,
  pasteAction
} from '../../slices/blueprint'
import { Middleware } from '@reduxjs/toolkit'
import { RootState } from '../../slices'

/**
 * Array of action types containing the directory attribute to be injected
 */
const directoryDependentActionTypes = [
  addNodesAction.type,
  copyAction.type,
  cutAction.type,
  duplicateAction.type,
  loadBlueprintAction.type,
  pasteAction.type
]

export const directoryMiddleware: Middleware<{}, RootState> = store => {
  return next => (action) => {
    if (
      typeof action === 'object' &&
      action !== null &&
      'type' in action &&
      typeof action.type === 'string'
    ) {
      // Inject the directory state into actions that depend on it
      if ((directoryDependentActionTypes as string[]).includes(action.type)) {
        action = {
          ...action,
          payload: {
            ...(
              'payload' in action && typeof action.payload === 'object'
                ? action.payload
                : {}
            ),
            directory: store.getState().directory
          }
        }
      }
    }
    return next(action)
  }
}
