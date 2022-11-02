
import {
  addNodesAction,
  copyAction,
  cutAction,
  loadBlueprintAction,
  pasteAction
} from '../../slices/blueprint'
import { AnyAction, Middleware } from '@reduxjs/toolkit'
import { RootState } from '../../slices'

/**
 * Array of action types containing the directory attribute to be injected
 */
const directoryDependentActionTypes = [
  cutAction.type,
  copyAction.type,
  pasteAction.type,
  loadBlueprintAction.type,
  addNodesAction.type
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
