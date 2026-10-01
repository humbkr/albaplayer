import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { playerTogglePlayPause } from 'modules/player/store/store'
import { playerSelector } from 'modules/player/store/selectors'

export default function usePlaybackKeys() {
  const dispatch = useAppDispatch()
  const { loading } = useAppSelector(playerSelector)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      e.preventDefault()
      // Playback is locked while the next track is being fetched.
      if (e.code === 'Space' && !loading) {
        dispatch(playerTogglePlayPause())
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    // Don't forget to clean up
    return function cleanup() {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [dispatch, loading])
}
