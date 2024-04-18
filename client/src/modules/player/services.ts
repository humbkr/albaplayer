import {
  playerTogglePlayPause,
  queueAddTracks,
  queueAddTracksAfterCurrent,
  queueClear,
  setItemFromQueue,
} from 'modules/player/store/store'
import { useGetTracksFromPlaylist } from 'modules/collections/services/services'
import store from 'store/store'
import { useAppDispatch } from 'store/hooks'

export function useAddPlaylist() {
  const getTracksFromPlaylist = useGetTracksFromPlaylist()
  const dispatch = useAppDispatch()

  return (playlistId: string) => {
    const { player } = store.getState()

    dispatch(queueAddTracks(getTracksFromPlaylist(playlistId)))

    if (!player.track) {
      dispatch(setItemFromQueue(0))
    }
  }
}

export function usePlayPlaylist() {
  const getTracksFromPlaylist = useGetTracksFromPlaylist()
  const dispatch = useAppDispatch()

  return (playlistId: string) => {
    dispatch(queueClear())
    dispatch(queueAddTracks(getTracksFromPlaylist(playlistId)))
    dispatch(setItemFromQueue(0))
    dispatch(playerTogglePlayPause(true))
  }
}

export function usePlayPlaylistAfterCurrent() {
  const getTracksFromPlaylist = useGetTracksFromPlaylist()
  const dispatch = useAppDispatch()

  return (playlistId: string) => {
    const { player } = store.getState()

    dispatch(queueAddTracksAfterCurrent(getTracksFromPlaylist(playlistId)))

    if (!player.track) {
      dispatch(setItemFromQueue(0))
    }
  }
}
