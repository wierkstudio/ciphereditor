
import { AppDispatch } from '../../store'
import { endWireAction, popModalAction, pushDeadEndModalAction, pushModalAction, toggleAddModalAction, toggleEmbedMaximizedAction } from '../ui'
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
  closeModal: popModalAction({}),
  redo: redoAction(),
  removeNode: removeNodeAction({}),
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
  'backspace': 'removeNode',
  'control+b': 'toggleMaximized',
  'control+k': 'toggleAddModal',
  'control+s': 'shareBlueprint',
  'control+shift+z': 'redo',
  // Windows and Linux systems that use Cinnamon as a DE use Ctrl+Y for redo
  'control+y': 'redo',
  'control+z': 'undo',
  'control+,': 'showSettings',
  'delete': 'removeNode',
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
  'backspace': 'removeNode',
  'delete': 'removeNode',
  'escape': ['closeModal', 'endWire'],
  'meta+arrowup': 'leaveProgram',
  'meta+b': 'toggleMaximized',
  'meta+enter': 'enterProgram',
  'meta+k': 'toggleAddModal',
  'meta+s': 'shareBlueprint',
  'meta+z': 'undo',
  'meta+,': 'showSettings',
  'shift+meta+z': 'redo'
  /* eslint-enable quote-props */
}
