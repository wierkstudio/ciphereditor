
import { AppDispatch } from '../../store'
import { endWireAction, popModalAction, toggleAddModalAction, toggleEmbedMaximizedAction } from '../ui'
import { enterProgramAction, leaveProgramAction, moveNodeAction, redoAction, removeNodeAction, undoAction } from '../blueprint'

export type KeyBindingDispatchAction = Parameters<AppDispatch>[0]

const nudgeAmount = 8

/**
 * Object mapping available key binding target names to dispatch actions that
 * will be triggered in Redux when a matching key combination is pressed.
 */
export const keyBindingTargetDispatchActions: Record<string, KeyBindingDispatchAction> = {
  endWire: { type: endWireAction.type },
  enterProgram: { type: enterProgramAction.type },
  leaveProgram: { type: leaveProgramAction.type },
  nudgeNodeDown: { type: moveNodeAction.type, payload: { x: 0, y: nudgeAmount } },
  nudgeNodeLeft: { type: moveNodeAction.type, payload: { x: -nudgeAmount, y: 0 } },
  nudgeNodeRight: { type: moveNodeAction.type, payload: { x: nudgeAmount, y: 0 } },
  nudgeNodeUp: { type: moveNodeAction.type, payload: { x: 0, y: -nudgeAmount } },
  popModal: { type: popModalAction.type },
  redo: { type: redoAction.type },
  removeNode: { type: removeNodeAction.type },
  toggleAddModal: { type: toggleAddModalAction.type },
  toggleMaximized: { type: toggleEmbedMaximizedAction.type },
  undo: { type: undoAction.type }
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
