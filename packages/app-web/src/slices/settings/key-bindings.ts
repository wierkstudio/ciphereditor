
import {
  endWireAction,
  popModalAction,
  pushDeadEndModalAction,
  pushModalAction,
  toggleAddModalAction,
  toggleEmbedMaximizedAction
} from '../ui'
import {
  copyAction,
  cutAction,
  deleteAction,
  duplicateAction,
  enterProgramAction,
  leaveProgramAction,
  moveAction,
  pasteAction,
  redoAction,
  selectAllAction,
  undoAction
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
  duplicate: duplicateAction({}),
  endWire: endWireAction({}),
  enterProgram: enterProgramAction({}),
  leaveProgram: leaveProgramAction({}),
  nudgeNodeDown: moveAction({ delta: { x: 0, y: nudgeAmount } }),
  nudgeNodeLeft: moveAction({ delta: { x: -nudgeAmount, y: 0 } }),
  nudgeNodeRight: moveAction({ delta: { x: nudgeAmount, y: 0 } }),
  nudgeNodeUp: moveAction({ delta: { x: 0, y: -nudgeAmount } }),
  paste: pasteAction({}),
  redo: redoAction(),
  selectAll: selectAllAction(),
  // TODO: Replace by save modal (when it becomes available)
  saveBlueprint: pushDeadEndModalAction({}),
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
  'control+a': 'selectAll',
  'control+b': 'toggleMaximized',
  'control+c': 'copy',
  'control+d': 'duplicate',
  'control+k': 'toggleAddModal',
  'control+s': 'saveBlueprint',
  'control+shift+z': 'redo',
  'control+v': 'paste',
  'control+x': 'cut',
  // Windows and Linux systems that use Cinnamon as a DE use Ctrl+Y for redo
  'control+y': 'redo',
  'control+z': 'undo',
  'delete': 'delete',
  'enter': 'enterProgram',
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
  'meta+a': 'selectAll',
  'meta+arrowdown': 'enterProgram',
  'meta+arrowup': 'leaveProgram',
  'meta+b': 'toggleMaximized',
  'meta+c': 'copy',
  'meta+d': 'duplicate',
  'meta+k': 'toggleAddModal',
  'meta+s': 'saveBlueprint',
  'meta+v': 'paste',
  'meta+x': 'cut',
  'meta+z': 'undo',
  'shift+meta+z': 'redo'
  /* eslint-enable quote-props */
}
