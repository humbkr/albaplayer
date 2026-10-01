import { useEffect, useState } from 'react'

/**
 * Returns true once `value` has been true for `delayMs`, and false as soon as
 * `value` turns false. Useful to show feedback (e.g. a loader) only for
 * operations slow enough to need it, without flashing it for fast ones.
 */
export default function useDelayedFlag(value: boolean, delayMs: number) {
  const [isDelayElapsed, setIsDelayElapsed] = useState(false)

  useEffect(() => {
    if (!value) {
      return
    }

    const timeoutId = setTimeout(() => setIsDelayElapsed(true), delayMs)

    return () => {
      clearTimeout(timeoutId)
      // The next activation must wait for the full delay again.
      setIsDelayElapsed(false)
    }
  }, [value, delayMs])

  // Checking `value` too avoids a render showing a stale true after it turns
  // false, before the effect cleanup resets the state.
  return value && isDelayElapsed
}
