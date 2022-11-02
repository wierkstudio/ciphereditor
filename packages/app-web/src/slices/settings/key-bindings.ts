
import {
  endWireAction,
  popModalAction,
  pushDeadEndModalAction,
  pushModalAction,
  toggleAddModalAction,
  toggleEmbedMaximizedAction
} from '../ui'
import {
  enterProgramAction,
  leaveProgramAction,
  redoAction,
  deleteAction,
  undoAction,
  cutAction,
  copyAction,
  pasteAction,
  moveAction
} from '../blueprint'
import { AppDispatch } from '../../store'

export type KeyBindingDispatchAction = Parameters<AppDispatch>[0]

const nudgeAmount = 16

/**
 * Object mapping available key binding target names to dispatch actions that
 * will be triggered in Redux when a matching key combination is pressed.
 */
export const keyBindingTargetDispatchActions: Record<string, KeyBindingDispatchAction> = {
  closeModal: popModalAction({}),
  copy: copyAction({}),
  cut: cutAction({}),
  delete: deleteAction({}),
  endWire: endWireAction({}),
  enterProgram: enterProgramAction({}),
  leaveProgram: leaveProgramAction({}),
  nudgeNodeDown: moveAction({ x: 0, y: nudgeAmount }),
  nudgeNodeLeft: moveAction({ x: -nudgeAmount, y: 0 }),
  nudgeNodeRight: moveAction({ x: nudgeAmount, y: 0 }),
  nudgeNodeUp: moveAction({ x: 0, y: -nudgeAmount }),
  paste: pasteAction({}),
  redo: redoAction(),
  // TODO: Replace by share modal (when it becomes available)
  shareBlueprint: pushDeadEndModalAction({}),
  showSettings: pushModalAction({ payload: { type: 'settings' } }),
  toggleAddModal: toggleAddModalAction({}),
  toggleMaximized: toggleEmbedMaximizedAction({}),
  undo: undoAction()
}

/**
 * Object mapping default key combinations to key binding targets.
 * Key combination order: control+alt+shift+meta+key
 */
export const defaultKeyBindings: Record<string, string | string[]> = {
  /* eslint-disable quote-props */
  'alt+arrowup': 'leaveProgram',
  'arrowdown': 'nudgeNodeDown',
  'arrowleft': 'nudgeNodeLeft',
  'arrowright': 'nudgeNodeRight',
  'arrowup': 'nudgeNodeUp',
  'backspace': 'delete',
  'control+,': 'showSettings',
  'control+b': 'toggleMaximized',
  'control+c': 'copy',
  'control+k': 'toggleAddModal',
  'control+s': 'shareBlueprint',
  'control+shift+z': 'redo',
  'control+v': 'paste',
  'control+x': 'cut',
  // Windows and Linux systems that use Cinnamon as a DE use Ctrl+Y for redo
  'control+y': 'redo',
  'control+z': 'undo',
  'delete': 'delete',
  'escape': ['closeModal', 'endWire']
  /* eslint-enable quote-props */
}

/**
 * Object mapping default key combinations specific to macOS to
 * key binding targets.
 * Key combination order: control+alt+shift+meta+key
 */
export const defaultMacOSKeyBindings: Record<string, string | string[]> = {
  /* eslint-disable quote-props */
  'arrowdown': 'nudgeNodeDown',
  'arrowleft': 'nudgeNodeLeft',
  'arrowright': 'nudgeNodeRight',
  'arrowup': 'nudgeNodeUp',
  'backspace': 'delete',
  'delete': 'delete',
  'escape': ['closeModal', 'endWire'],
  'meta+,': 'showSettings',
  'meta+arrowup': 'leaveProgram',
  'meta+b': 'toggleMaximized',
  'meta+c': 'copy',
  'meta+enter': 'enterProgram',
  'meta+k': 'toggleAddModal',
  'meta+s': 'shareBlueprint',
  'meta+v': 'paste',
  'meta+x': 'cut',
  'meta+z': 'undo',
  'shift+meta+z': 'redo'
  /* eslint-enable quote-props */
}
