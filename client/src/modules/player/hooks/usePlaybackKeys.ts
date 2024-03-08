import { useEffect } from 'react'
import { useAppDispatch } from 'store/hooks'
import { playerTogglePlayPause } from 'modules/player/store/store'

export default function usePlaybackKeys() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      e.preventDefault()
      if (e.code === 'Space') {
        dispatch(playerTogglePlayPause())
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    // Don't forget to clean up
    return function cleanup() {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [dispatch])
}
