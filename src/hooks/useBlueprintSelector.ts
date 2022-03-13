
import { TypedUseSelectorHook } from 'react-redux'
import { BlueprintState } from 'slices/blueprint/types/blueprint'
import useAppSelector from './useAppSelector'

/**
 * A hook to access the present blueprint state. This hook takes a blueprint
 * selector function as an argument.
 */
const useBlueprintSelector: TypedUseSelectorHook<BlueprintState> = <TSelected = unknown>(
  selector: (state: BlueprintState) => TSelected,
  equalityFn?: (left: TSelected, right: TSelected) => boolean
) =>
  useAppSelector(state => selector(state.blueprint.present), equalityFn)

export default useBlueprintSelector
