import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { playerTogglePlayPause } from 'modules/player/store/store'

export default function usePlaybackKeys() {
  const dispatch = useAppDispatch()
  // Select only `loading`: the player state changes every second (progress),
  // and this hook runs in the layout, which would re-render the whole app.
  const loading = useAppSelector((state) => state.player.loading)

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
