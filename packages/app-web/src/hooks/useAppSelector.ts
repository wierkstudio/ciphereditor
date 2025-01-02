
import { RootState } from '../slices'
import { useSelector } from 'react-redux'

// Use throughout your app instead of plain `useSelector`
const useAppSelector = useSelector.withTypes<RootState>()
export default useAppSelector
