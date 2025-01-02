
import useAppSelector from './useAppSelector'
import { BlueprintState } from '../slices/blueprint/types/blueprint'
import { TypedUseSelectorHook } from 'react-redux'

/**
 * A hook to access the present blueprint state. This hook takes a blueprint
 * selector function as an argument.
 */
const useBlueprintSelector: TypedUseSelectorHook<BlueprintState> =
  (selector, options) =>
    useAppSelector(state => selector(state.blueprint.present), options)

export default useBlueprintSelector
