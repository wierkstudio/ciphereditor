
import useAppSelector from './useAppSelector'
import { BlueprintState } from '../slices/blueprint/types/blueprint'
import { EqualityFn, NoInfer, TypedUseSelectorHook } from 'react-redux'

/**
 * A hook to access the present blueprint state. This hook takes a blueprint
 * selector function as an argument.
 */
const useBlueprintSelector: TypedUseSelectorHook<BlueprintState> = <TSelected>(
  selector: (state: BlueprintState) => TSelected,
  equalityFn?: EqualityFn<NoInfer<TSelected>> | undefined
) => useAppSelector(state => selector(state.blueprint.present), equalityFn)

export default useBlueprintSelector
