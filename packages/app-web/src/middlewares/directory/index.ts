
import {
  addNodesAction,
  copyAction,
  cutAction,
  duplicateAction,
  loadBlueprintAction,
  pasteAction
} from '../../slices/blueprint'
import { AnyAction, Middleware } from '@reduxjs/toolkit'
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
  return next => (action: AnyAction) => {
    // Inject the directory state into actions that depend on it
    if (directoryDependentActionTypes.includes(action.type)) {
      if (action.payload === undefined) {
        action.payload = {
          directory: store.getState().directory
        }
      } else if (action.payload.directory === undefined) {
        action.payload.directory = store.getState().directory
      }
    }
    return next(action)
  }
}
