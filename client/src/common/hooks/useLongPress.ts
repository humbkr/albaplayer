import type { LongPressReactEvents } from 'use-long-press'
import {
  useLongPress as useLongPressOriginal,
  LongPressEventType,
} from 'use-long-press'

export default function useLongPress(callback: () => void) {
  const filterEvents = (event: LongPressReactEvents) => {
    // Filter right clicks.
    return !(
      event.nativeEvent instanceof MouseEvent &&
      (event.nativeEvent.which === 3 ||
        event.nativeEvent.button === 2 ||
        event.ctrlKey ||
        event.metaKey)
    )
  }

  return useLongPressOriginal(
    () => {
      callback()
    },
    {
      cancelOnMovement: true,
      // Use pointer events in dev mode for easier testing with a mouse.
      detect: import.meta.env.VITE_DEV_MODE
        ? LongPressEventType.Pointer
        : LongPressEventType.Touch,
      filterEvents,
    }
  )
}
