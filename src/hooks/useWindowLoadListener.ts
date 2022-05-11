
import { useEffect } from 'react'

/**
 * Call the given listener function initially and on window load
 */
const useWindowLoadListener = (listener: () => any): void => {
  useEffect(() => {
    if (document.readyState === 'complete') {
      listener()
    } else {
      window.addEventListener('load', listener)
      return () => {
        window.removeEventListener('load', listener)
      }
    }
  }, [listener])
}

export default useWindowLoadListener
