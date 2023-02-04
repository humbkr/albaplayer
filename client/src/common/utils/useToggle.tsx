import { useCallback, useState } from 'react'

export function useToggle(defaultValue = false) {
  const [isToggled, setIsToggled] = useState(defaultValue)

  const toggle = useCallback(
    (force?: boolean) => setIsToggled(force ?? !isToggled),
    [isToggled]
  )

  return { isToggled, toggle }
}
