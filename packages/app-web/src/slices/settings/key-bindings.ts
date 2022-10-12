
import { AppDispatch } from '../../store'
import { endWireAction, popModalAction, toggleAddModalAction, toggleEmbedMaximizedAction } from '../ui'
import { enterProgramAction, leaveProgramAction, moveNodeAction, redoAction, removeNodeAction, undoAction } from '../blueprint'

export type KeyBindingDispatchAction = Parameters<AppDispatch>[0]

const nudgeAmount = 16

/**
 * Object mapping available key binding target names to dispatch actions that
 * will be triggered in Redux when a matching key combination is pressed.
 */
export const keyBindingTargetDispatchActions: Record<string, KeyBindingDispatchAction> = {
  endWire: endWireAction({}),
  enterProgram: enterProgramAction({}),
  leaveProgram: leaveProgramAction({}),
  nudgeNodeDown: moveNodeAction({ x: 0, y: nudgeAmount }),
  nudgeNodeLeft: moveNodeAction({ x: -nudgeAmount, y: 0 }),
  nudgeNodeRight: moveNodeAction({ x: nudgeAmount, y: 0 }),
  nudgeNodeUp: moveNodeAction({ x: 0, y: -nudgeAmount }),
  popModal: popModalAction({}),
  redo: redoAction(),
  removeNode: removeNodeAction({}),
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
  'arrowdown': 'nudgeNodeDown',
  'arrowleft': 'nudgeNodeLeft',
  'arrowright': 'nudgeNodeRight',
  'arrowup': 'nudgeNodeUp',
  'backspace': 'removeNode',
  'control+b': 'toggleMaximized',
  'control+k': 'toggleAddModal',
  'control+shift+z': 'redo',
  // Windows and Linux systems that use Cinnamon as a DE use Ctrl+Y for redo
  'control+y': 'redo',
  'control+z': 'undo',
  'delete': 'removeNode',
  'escape': ['popModal', 'endWire']
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
  'backspace': 'removeNode',
  'delete': 'removeNode',
  'escape': ['popModal', 'endWire'],
  'meta+arrowup': 'leaveProgram',
  'meta+b': 'toggleMaximized',
  'meta+enter': 'enterProgram',
  'meta+k': 'toggleAddModal',
  'meta+z': 'undo',
  'shift+meta+z': 'redo'
  /* eslint-enable quote-props */
}
