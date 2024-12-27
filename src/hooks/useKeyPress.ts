import { DependencyList, useEffect } from 'react'

export const useKeyPress = (key: string, onKeyPress: VoidFunction, dependencies: DependencyList) => {
  useEffect(() => {
    const handleKeyPress = (evt: KeyboardEvent) => {
      if (evt.key === key) onKeyPress()
    }

    window.addEventListener('keydown', handleKeyPress)

    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [key, ...dependencies])
}
