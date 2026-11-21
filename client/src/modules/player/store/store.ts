import libraryAPI from 'modules/library/api'
import { immutableSortTracks } from 'common/utils/utils'
import { playerSlice } from 'modules/player/store/player.store'
import { queueSlice } from 'modules/player/store/queue.store'
import type { LibraryStateType } from 'modules/library/store'
import {
  PlayerPlaybackMode,
  getNextShuffleStep,
  getPreviousShuffleStep,
} from 'modules/player/utils'

export { playerSlice, queueSlice }
export const {
  playerTogglePlayPause,
  playerToggleShuffle,
  playerToggleRepeat,
  playerSetVolume,
  playerSetTrack,
  playerSetDuration,
  playerSetProgress,
  playerStartLoading,
  playerFinishLoading,
} = playerSlice.actions
export const {
  queueAddTracks,
  queueRemoveTrack,
  queueClear,
  queueReplace,
  queueSetCurrent,
  queueAddTracksAfterCurrent,
  queueSetShuffleHistory,
} = queueSlice.actions

/*
 * Fetches a track's full info and makes it the current track.
 *
 * Track loads can overlap (next / previous stay enabled while loading, and
 * library actions can start another one), so only the most recent load is
 * applied: an older response is dropped and can neither replace the newer
 * track nor clear its loading state.
 *
 * Resolves to true if the track was applied.
 */
const loadTrack =
  (trackId: string, queuePosition: number): AppThunk<Promise<boolean>> =>
  async (dispatch, getState) => {
    dispatch(playerStartLoading(queuePosition))
    const requestId = getState().player.loadingRequestId

    try {
      const response = await libraryAPI.getFullTrackInfo(trackId)

      if (getState().player.loadingRequestId !== requestId) {
        return false
      }

      dispatch(playerSetTrack(response.data.track))
      dispatch(queueSetCurrent(queuePosition))

      return true
    } finally {
      dispatch(playerFinishLoading(requestId))
    }
  }

/*
 * Queue position that next / previous navigate from: the target of the
 * pending load if there is one, so that repeated presses chain instead of all
 * targeting the same track. Otherwise the current item, i.e. the last track
 * actually loaded, which is also where navigation resumes after a failed load.
 */
const getNavigationPosition = (state: RootState) =>
  state.player.loading ? state.player.loadingQueuePosition : state.queue.current

export const setItemFromQueue =
  (itemPosition: number): AppThunk<Promise<boolean>> =>
  async (dispatch, getState) => {
    const { queue } = getState()

    if (queue.items.length === 0 || queue.items.length <= itemPosition) {
      return false
    }

    return dispatch(loadTrack(queue.items[itemPosition].track.id, itemPosition))
  }

/*
 * Loads a queue item and plays it once loaded, unless a newer load superseded
 * it in the meantime. Playback is not toggled before the load completes,
 * otherwise the previous track would resume while the new one is fetched.
 */
export const playItemFromQueue =
  (itemPosition: number): AppThunk<Promise<void>> =>
  async (dispatch) => {
    const applied = await dispatch(setItemFromQueue(itemPosition))
    if (applied) {
      dispatch(playerTogglePlayPause(true))
    }
  }

/*
 * Replaces the queue and plays its first track.
 */
const replaceQueueAndPlay =
  (tracks: Track[]): AppThunk<Promise<void>> =>
  (dispatch) => {
    dispatch(queueClear())
    dispatch(queueAddTracks(tracks))

    return dispatch(playItemFromQueue(0))
  }

export const playTrack = (id: string) => playTracks([id])
export const playTracks =
  (trackIds: string[]): AppThunk<Promise<void>> =>
  (dispatch, getState) => {
    const { library } = getState()

    const tracks = trackIds.map((id) => {
      const track = { ...library.tracks[id] }
      track.artist = library.artists[track.artistId]
      track.album = library.albums[track.albumId]

      return track
    })

    return dispatch(replaceQueueAndPlay(tracks))
  }

export const playAlbum = (id: string) => playAlbums([id])
export const playAlbums =
  (albumIds: string[]): AppThunk<Promise<void>> =>
  (dispatch, getState) => {
    const { library } = getState()

    const tracks = albumIds.flatMap((id) =>
      immutableSortTracks(getTracksFromAlbum(id, library), 'album')
    )

    return dispatch(replaceQueueAndPlay(tracks))
  }

export const playAlbumDisc = (albumId: string, disc: string) =>
  playAlbumDiscs(albumId, [disc])
export const playAlbumDiscs =
  (albumId: string, discs: string[]): AppThunk<Promise<void>> =>
  (dispatch, getState) => {
    const { library } = getState()

    const tracks = getTracksFromAlbum(albumId, library).filter((track) =>
      discs.includes(track.disc as string)
    )

    return dispatch(replaceQueueAndPlay(immutableSortTracks(tracks, 'album')))
  }

export const playArtist = (id: string) => playArtists([id])
export const playArtists =
  (artistIds: string[]): AppThunk<Promise<void>> =>
  (dispatch, getState) => {
    const { library } = getState()

    const tracks = artistIds.flatMap((id) =>
      immutableSortTracks(getTracksFromArtist(id, library), 'number')
    )

    return dispatch(replaceQueueAndPlay(tracks))
  }

export const playTrackAfterCurrent = (id: string) =>
  playTracksAfterCurrent([id])
export const playTracksAfterCurrent =
  (trackIds: string[]): AppThunk =>
  (dispatch, getState) => {
    const { library, player } = getState()

    const tracks = trackIds.map((id) => {
      const track = { ...library.tracks[id] }
      track.artist = library.artists[track.artistId]
      track.album = library.albums[track.albumId]

      return track
    })

    dispatch(queueAddTracksAfterCurrent(tracks))

    if (!player.track) {
      dispatch(setItemFromQueue(0))
    }
  }

export const playAlbumAfterCurrent = (id: string) =>
  playAlbumsAfterCurrent([id])
export const playAlbumsAfterCurrent =
  (albumIds: string[]): AppThunk =>
  (dispatch, getState) => {
    const { library, player } = getState()

    const tracks = albumIds.flatMap((id) =>
      immutableSortTracks(getTracksFromAlbum(id, library), 'album')
    )

    dispatch(queueAddTracksAfterCurrent(tracks))

    if (!player.track) {
      dispatch(setItemFromQueue(0))
    }
  }

export const playAlbumDiscAfterCurrent = (albumId: string, disc: string) =>
  playAlbumDiscsAfterCurrent(albumId, [disc])
export const playAlbumDiscsAfterCurrent =
  (albumId: string, discs: string[]): AppThunk =>
  (dispatch, getState) => {
    const { library, player } = getState()

    const tracks = getTracksFromAlbum(albumId, library).filter((track) =>
      discs.includes(track.disc as string)
    )

    dispatch(queueAddTracksAfterCurrent(immutableSortTracks(tracks, 'album')))

    if (!player.track) {
      dispatch(setItemFromQueue(0))
    }
  }

export const playArtistAfterCurrent = (id: string) =>
  playArtistsAfterCurrent([id])
export const playArtistsAfterCurrent =
  (artistIds: string[]): AppThunk =>
  (dispatch, getState) => {
    const { library, player } = getState()

    const tracks = artistIds.flatMap((id) =>
      immutableSortTracks(getTracksFromArtist(id, library), 'number')
    )

    dispatch(queueAddTracksAfterCurrent(tracks))

    if (!player.track) {
      dispatch(setItemFromQueue(0))
    }
  }

export const addTrack = (id: string) => addTracks([id])
export const addTracks =
  (trackIds: string[]): AppThunk =>
  (dispatch, getState) => {
    const { library, player } = getState()

    const tracks = trackIds.map((id) => {
      const track = { ...library.tracks[id] }
      track.artist = library.artists[track.artistId]
      track.album = library.albums[track.albumId]

      return track
    })

    dispatch(queueAddTracks(tracks))

    if (!player.track) {
      dispatch(setItemFromQueue(0))
    }
  }

export const addAlbum = (id: string) => addAlbums([id])
export const addAlbums =
  (albumIds: string[]): AppThunk =>
  (dispatch, getState) => {
    const { library, player } = getState()

    const tracks = albumIds.flatMap((id) =>
      immutableSortTracks(getTracksFromAlbum(id, library), 'album')
    )

    dispatch(queueAddTracks(tracks))

    if (!player.track) {
      dispatch(setItemFromQueue(0))
    }
  }

export const addAlbumDisc = (albumId: string, disc: string) =>
  addAlbumDiscs(albumId, [disc])
export const addAlbumDiscs =
  (albumId: string, discs: string[] = []): AppThunk =>
  (dispatch, getState) => {
    const { library, player } = getState()

    const tracks = getTracksFromAlbum(albumId, library).filter((track) =>
      discs.includes(track.disc as string)
    )

    dispatch(queueAddTracks(immutableSortTracks(tracks, 'album')))

    if (!player.track) {
      dispatch(setItemFromQueue(0))
    }
  }

export const addArtist = (id: string): AppThunk => addArtists([id])
export const addArtists =
  (artistIds: string[]): AppThunk =>
  (dispatch, getState) => {
    const { library, player } = getState()

    const tracks = artistIds.flatMap((id) =>
      immutableSortTracks(getTracksFromArtist(id, library), 'number')
    )

    dispatch(queueAddTracks(tracks))

    if (!player.track) {
      dispatch(setItemFromQueue(0))
    }
  }

type NextQueueStep = {
  // Queue position to play.
  position: number
  // Shuffle history to save once that position is played, in shuffle mode.
  shuffleHistory?: string[]
}

/*
 * Picks the track to play after the current one, or null if there is no
 * further track to play.
 */
export const getNextQueueStep = (state: RootState): NextQueueStep | null => {
  const { items } = state.queue

  if (items.length === 0) {
    return null
  }

  if (!state.player.track) {
    // First play after launch: start with the first track of the queue.
    return { position: 0 }
  }

  const position = getNavigationPosition(state)
  const loopAll =
    state.player.repeat === PlayerPlaybackMode.PLAYER_REPEAT_LOOP_ALL

  if (state.player.shuffle) {
    // A random track not played yet in the shuffle round.
    const shuffleStep = getNextShuffleStep(
      items,
      position,
      state.queue.shuffleHistory,
      loopAll
    )

    return shuffleStep
      ? { position: shuffleStep.position, shuffleHistory: shuffleStep.history }
      : null
  }

  if (position + 1 < items.length) {
    return { position: position + 1 }
  }

  if (loopAll) {
    // End of the queue: loop back to the first track.
    return { position: 0 }
  }

  return null
}

/*
 * Selects the next track to play from the queue, get its info,
 * and dispatch required actions.
 *
 * nextStep lets the caller apply a step it already picked (e.g. a shuffled
 * one) instead of picking a new one.
 */
export const setNextTrack = (
  endOfTrack: boolean,
  nextStep?: NextQueueStep | null
): AppThunk =>
  function (dispatch, getState) {
    const state = getState() as RootState
    const step = nextStep === undefined ? getNextQueueStep(state) : nextStep

    if (step === null) {
      // No further track to play.
      if (endOfTrack) {
        // If the last track of the queue finished playing reset the player
        dispatch(playerSetProgress(0))
        dispatch(playerTogglePlayPause(false))
      }
      // Else setNextTrack call is the result of a user action so do nothing.
      return null
    }

    if (step.shuffleHistory) {
      dispatch(queueSetShuffleHistory(step.shuffleHistory))
    }

    const newQueuePosition = step.position
    const nextTrackId = state.queue.items[newQueuePosition].track.id

    return dispatch(loadTrack(nextTrackId, newQueuePosition)).then(
      (applied) => {
        if (applied && (state.player.playing || endOfTrack)) {
          dispatch(playerTogglePlayPause(true))
        }
      }
    )
  }

/*
 * Selects the previous track to play from the queue, get its info,
 * and dispatch required actions.
 */
export const setPreviousTrack = (): AppThunk =>
  function (dispatch, getState) {
    const state = getState()
    const position = getNavigationPosition(state)

    let prevTrackId = '0'
    let newQueuePosition = 0

    // Get trackId of the previous track in playlist.
    if (!state.player.track) {
      // Do nothing.
      return null
    }

    if (state.player.shuffle) {
      // Go back to the track played before in the shuffle round.
      const shuffleStep = getPreviousShuffleStep(
        state.queue.items,
        position,
        state.queue.shuffleHistory
      )
      if (!shuffleStep) {
        return null
      }

      dispatch(queueSetShuffleHistory(shuffleStep.history))
      newQueuePosition = shuffleStep.position
      prevTrackId = state.queue.items[newQueuePosition].track.id
    } else if (position - 1 >= 0) {
      // Get previous song in queue.
      newQueuePosition = position - 1
      prevTrackId = state.queue.items[newQueuePosition].track.id
    } else if (
      state.player.repeat === PlayerPlaybackMode.PLAYER_REPEAT_LOOP_ALL
    ) {
      // Beginning of the queue.
      // Loop back to the last track of the queue.
      newQueuePosition = state.queue.items.length - 1
      prevTrackId = state.queue.items[newQueuePosition].track.id
    } else {
      // No further track to play, do nothing.
      return null
    }

    return dispatch(loadTrack(prevTrackId, newQueuePosition))
  }

export const getTracksFromAlbum = (
  id: string,
  library: LibraryStateType
): Track[] => {
  const filteredTracks = Object.values(library.tracks).filter(
    (item) => id === item.albumId
  )

  return filteredTracks.map((track) => ({
    ...track,
    artist: track.artistId ? library.artists[track.artistId] : undefined,
    album: library.albums[track.albumId as string],
  }))
}

// TODO tracks should be ordered per album then track number.
export const getTracksFromArtist = (
  id: string,
  library: LibraryStateType
): Track[] => {
  const filteredTracks = Object.values(library.tracks).filter(
    (item) => id === item.artistId
  )

  return filteredTracks.map((track) => ({
    ...track,
    artist: library.artists[track.artistId as string],
    album: track.albumId ? library.albums[track.albumId] : undefined,
  }))
}
