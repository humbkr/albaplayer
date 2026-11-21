import { useAppDispatch, useAppSelector, useAppStore } from 'store/hooks'
import { playerSelector, queueSelector } from 'modules/player/store/selectors'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import {
  getNextQueueStep,
  playerSetDuration,
  playerSetProgress,
  playerSetVolume,
  playerTogglePlayPause,
  playerToggleRepeat,
  playerToggleShuffle,
  setNextTrack,
  setPreviousTrack,
} from 'modules/player/store/store'
import { PlayerPlaybackMode } from 'modules/player/utils'
import APIConstants from 'api/constants'
import { useInterval } from 'common/utils/useInterval'
import useDelayedFlag from 'common/hooks/useDelayedFlag'
import { useTranslation } from 'react-i18next'
import { refreshToken } from 'modules/user/authApi'

function getListeningVolume(volumeBarValue: number) {
  return volumeBarValue ** 2
}

// Same URL as the `src` the API returns for a track.
function getStreamUrl(trackId: string) {
  return `${APIConstants.BACKEND_BASE_URL}/stream/${trackId}`
}

const STALL_RECOVERY_DELAY_MS = 10_000
const MAX_RECOVERY_ATTEMPTS = 3
// Playback ending more than this before the track duration is treated as a
// failed stream request rather than the end of the track.
const EARLY_END_TOLERANCE_S = 2
// Most tracks load faster than this: the loader only shows for slow ones.
export const LOADER_DELAY_MS = 1000

// TODO https://stackoverflow.com/questions/48277432/load-html5-audio-from-dynamic-content-provider-with-authentication
export default function usePlayer() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const store = useAppStore()

  const {
    shuffle,
    repeat,
    volume,
    track,
    playing,
    loading,
    progress,
    duration,
  } = useAppSelector(playerSelector)
  const queue = useAppSelector(queueSelector)
  // `loading` locks playback immediately; the loader itself is delayed.
  const showLoader = useDelayedFlag(loading, LOADER_DELAY_MS)

  const onPlay = useCallback(async () => {
    dispatch(playerTogglePlayPause(true))
    try {
      await playerRef.current?.play()
    } catch {
      dispatch(playerTogglePlayPause(false))
    }
  }, [dispatch])

  const onPause = useCallback(async () => {
    dispatch(playerTogglePlayPause(false))
    await playerRef.current?.pause()
  }, [dispatch])

  const onStop = useCallback(async () => {
    dispatch(playerTogglePlayPause(false))
    await playerRef.current?.pause()
  }, [dispatch])

  const handleTogglePlayPause = useCallback(async () => {
    if (playing) {
      await onPause()
    } else {
      await onPlay()
    }
  }, [onPause, onPlay, playing])

  const handleSetProgress = (newProgress: number) => {
    let progress = newProgress || 0
    const duration = playerRef.current.duration
    if (progress > duration) {
      progress = duration
    }

    playerRef.current.currentTime = progress
    dispatch(playerSetProgress(progress))
  }

  const handleSetVolume = (newVolume: number) => {
    playerRef.current.volume = getListeningVolume(newVolume)
    dispatch(playerSetVolume(newVolume))
  }

  const handleSetPreviousTrack = useCallback(() => {
    dispatch(setPreviousTrack())
  }, [dispatch])

  const handleSetNextTrack = useCallback(
    async (endOfTrack?: boolean, repeatMode?: PlayerPlaybackMode) => {
      // If repeatMode is not set, use the initial one from the state.
      const repeatModeToUse = repeatMode ?? repeat
      if (
        endOfTrack &&
        repeatModeToUse === PlayerPlaybackMode.PLAYER_REPEAT_LOOP_ONE
      ) {
        // If we're repeating the current track, just reset the progress.
        playerRef.current.currentTime = 0
        await onPlay()
      } else {
        dispatch(setNextTrack(endOfTrack || false))
      }
    },
    [dispatch, onPlay, repeat]
  )

  const handleToggleRepeat = () => {
    dispatch(playerToggleRepeat())
  }

  const handleToggleShuffle = () => {
    dispatch(playerToggleShuffle())
  }

  // Last playback position seen while media data was loaded. Recovery uses it
  // because `currentTime` is not reliable once the element has failed: it can
  // read 0, and it reads 0 during the reload anyway.
  const lastPositionRef = useRef(0)
  // Track duration as reported by its metadata, i.e. before any early end.
  const metadataDurationRef = useRef(NaN)
  // Position of the last early end recovered from for the current track.
  const earlyEndPositionRef = useRef<number | null>(null)

  const audioElement = useMemo(() => {
    const audio = document.createElement('audio')
    audio.volume = getListeningVolume(volume)

    audio.onloadedmetadata = () => {
      metadataDurationRef.current = audio.duration
      dispatch(playerSetDuration(audio.duration))
    }
    audio.ontimeupdate = () => {
      if (audio.readyState >= HTMLMediaElement.HAVE_METADATA && !audio.error) {
        lastPositionRef.current = audio.currentTime
      }
    }

    return audio
    // Audio element is created once. Volume is only set at first load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const playerRef = useRef(audioElement)

  // Stall recovery state.
  const stallTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const recoveryAttemptsRef = useRef(0)
  // Prevents infinite retry loops when refreshing the auth token on error.
  const authRetryRef = useRef(false)
  // Stream started by handleTrackEnded before its track reached the store.
  const startedStreamUrlRef = useRef<string | null>(null)

  const clearStallRecovery = useCallback(() => {
    if (stallTimeoutRef.current) {
      clearTimeout(stallTimeoutRef.current)
      stallTimeoutRef.current = null
    }
  }, [])

  const scheduleStallRecovery = useCallback(() => {
    clearStallRecovery()

    const audio = playerRef.current
    if (!audio || audio.paused) {
      return
    }

    if (recoveryAttemptsRef.current >= MAX_RECOVERY_ATTEMPTS) {
      dispatch(playerTogglePlayPause(false))
      recoveryAttemptsRef.current = 0

      return
    }

    // This attempt stays current while stallTimeoutRef holds its id: a track
    // change, resumed playback or a newer stall clears or replaces it.
    const timeoutId = setTimeout(async () => {
      if (
        !audio.paused &&
        audio.readyState < HTMLMediaElement.HAVE_FUTURE_DATA
      ) {
        recoveryAttemptsRef.current += 1

        // The stall may be caused by an expired auth token, so refresh it
        // before re-buffering.
        await refreshToken()

        // Cancelled during the refresh, or paused by the user meanwhile:
        // leave the shared audio element alone.
        if (stallTimeoutRef.current !== timeoutId || audio.paused) {
          return
        }

        // Force re-buffering from the current position.
        // eslint-disable-next-line no-self-assign
        audio.currentTime = audio.currentTime
        audio.play().catch(() => {
          // A track change interrupts this play() with an AbortError: it
          // must not pause the new track.
          if (stallTimeoutRef.current === timeoutId) {
            dispatch(playerTogglePlayPause(false))
          }
        })
      }
    }, STALL_RECOVERY_DELAY_MS)
    stallTimeoutRef.current = timeoutId
  }, [clearStallRecovery, dispatch])

  const handleTrackEnded = () => {
    const state = store.getState()

    if (state.player.repeat === PlayerPlaybackMode.PLAYER_REPEAT_LOOP_ONE) {
      handleSetNextTrack(true)

      return
    }

    // IOS suspends a locked PWA as soon as playback stops, so the next track
    // must start within this event, before its info is fetched and rendered.
    const nextStep = getNextQueueStep(state)
    if (nextStep !== null) {
      const audio = playerRef.current
      const streamUrl = getStreamUrl(
        state.queue.items[nextStep.position].track.id
      )

      recoveryAttemptsRef.current = 0
      authRetryRef.current = false
      lastPositionRef.current = 0
      metadataDurationRef.current = NaN
      earlyEndPositionRef.current = null
      clearStallRecovery()

      startedStreamUrlRef.current = streamUrl
      audio.src = streamUrl
      // If it is blocked anyway, the track effect plays it once loaded.
      audio.play().catch(() => {})
    }

    dispatch(setNextTrack(true, nextStep))
  }

  // Keep a ref to handleTrackEnded so the audio element's onended callback
  // always calls the latest version without recreating the element.
  const handleTrackEndedRef = useRef(handleTrackEnded)
  handleTrackEndedRef.current = handleTrackEnded

  // Synchronises the audioElement state to redux state external changes.
  useEffect(() => {
    const isPlaying =
      !playerRef.current?.paused &&
      !playerRef.current?.ended &&
      0 < playerRef.current?.currentTime

    if (playing && !isPlaying && playerRef.current?.src) {
      playerRef.current.play()?.catch(() => {
        dispatch(playerTogglePlayPause(false))
      })
    } else if (!playing && isPlaying) {
      playerRef.current?.pause()
    }
  }, [playing, dispatch])

  // Changes audioElement source when redux track changes.
  useEffect(() => {
    // Aborted when the track changes, so a pending auth retry for the previous
    // track never touches the shared audio element or the playback state.
    const authRetryAbort = new AbortController()

    if (track) {
      const streamUrl = APIConstants.BACKEND_BASE_URL + track.src
      // Already started by handleTrackEnded, which reset its playback state:
      // reloading would restart it.
      if (startedStreamUrlRef.current !== streamUrl) {
        playerRef.current.src = streamUrl
        playerRef.current.load()
        lastPositionRef.current = 0
        metadataDurationRef.current = NaN
        earlyEndPositionRef.current = null
      }
      startedStreamUrlRef.current = null

      // Reset recovery state for new track.
      recoveryAttemptsRef.current = 0
      authRetryRef.current = false
      clearStallRecovery()

      // Recovery handlers: schedule re-buffering if audio stalls too long.
      playerRef.current.onwaiting = () => scheduleStallRecovery()
      playerRef.current.onstalled = () => scheduleStallRecovery()
      playerRef.current.onplaying = () => {
        clearStallRecovery()
        recoveryAttemptsRef.current = 0
        authRetryRef.current = false
      }
      // A stream request failed, most likely because the auth token expired
      // during a long pause: refresh it, then reload the track at `resumeAt`.
      const recoverStream = async (resumeAt: number) => {
        clearStallRecovery()

        if (!authRetryRef.current) {
          authRetryRef.current = true
          const refreshResult = await refreshToken()

          if (authRetryAbort.signal.aborted) {
            return
          }

          if (!refreshResult.error) {
            const audio = playerRef.current

            // One-shot listener: the permanent onloadedmetadata handler keeps
            // updating the duration.
            audio.addEventListener(
              'loadedmetadata',
              () => {
                audio.currentTime = resumeAt
              },
              { once: true, signal: authRetryAbort.signal }
            )
            // Reloads the current source rather than track.src: it can be the
            // next track, started by handleTrackEnded before reaching the store.
            audio.load()
            audio.play().catch(() => {
              // A track change interrupts this play() with an AbortError: it
              // must not pause the new track.
              if (!authRetryAbort.signal.aborted) {
                dispatch(playerTogglePlayPause(false))
              }
            })

            return
          }
        }

        dispatch(playerTogglePlayPause(false))
      }

      // Read the saved position now: `currentTime` is unreliable once failed.
      playerRef.current.onerror = () => recoverStream(lastPositionRef.current)

      // Chrome can end playback when a later stream request fails instead of
      // firing an error, which would silently skip the rest of the track.
      playerRef.current.onended = () => {
        const endedAt = playerRef.current.currentTime
        const endedEarly =
          metadataDurationRef.current - endedAt > EARLY_END_TOLERANCE_S
        // Ending early again at the same spot means the metadata duration is
        // wrong (e.g. a VBR file), not a failed request: accept the end.
        const sameSpotAsLastEarlyEnd =
          earlyEndPositionRef.current !== null &&
          Math.abs(endedAt - earlyEndPositionRef.current) <=
            EARLY_END_TOLERANCE_S

        if (endedEarly && !sameSpotAsLastEarlyEnd) {
          earlyEndPositionRef.current = endedAt
          recoverStream(endedAt)

          return
        }

        handleTrackEndedRef.current()
      }

      /* istanbul ignore next */
      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: track?.title || t('common.unknown'),
          artist: track?.artist?.name || t('common.unknown'),
          album: track?.album?.title || t('common.unknown'),
          artwork: [
            {
              src: APIConstants.BACKEND_BASE_URL + track?.cover,
              sizes: '512x512',
              type: 'image/png',
            },
          ],
        })
      }

      if (playing) {
        onPlay()
      }
    }

    dispatch(playerSetProgress(0))

    return () => authRetryAbort.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, track])

  // Cleanup stall recovery timeout on unmount.
  useEffect(() => {
    return () => clearStallRecovery()
  }, [clearStallRecovery])

  // Latest values for the OS media controls handlers, which are registered
  // once and must not be cleared and re-registered on every render.
  const mediaSessionStateRef = useRef({
    loading,
    onPlay,
    onPause,
    onStop,
    handleSetPreviousTrack,
    handleSetNextTrack,
  })
  mediaSessionStateRef.current = {
    loading,
    onPlay,
    onPause,
    onStop,
    handleSetPreviousTrack,
    handleSetNextTrack,
  }

  // OS media controls (lock screen, media keys). iOS decides which buttons
  // to show (previous / next vs -10s / +10s) from the handlers registered
  // when playback starts, and ignores later churn: keep the handlers
  // registered for the whole player lifetime, and register them again each
  // time playback starts.
  useEffect(() => {
    /* istanbul ignore next */
    if (!('mediaSession' in navigator)) {
      return
    }

    const registerHandlers = () => {
      const state = () => mediaSessionStateRef.current

      // OS media controls must respect the playback lock while the next track
      // is being fetched. onPlay itself stays unguarded: it also auto-plays
      // the new track, which happens before loading is cleared.
      navigator.mediaSession.setActionHandler('play', () => {
        if (!state().loading) {
          state().onPlay()
        }
      })
      navigator.mediaSession.setActionHandler('pause', () => {
        if (!state().loading) {
          state().onPause()
        }
      })
      navigator.mediaSession.setActionHandler('stop', () => state().onStop())
      navigator.mediaSession.setActionHandler('previoustrack', () =>
        state().handleSetPreviousTrack()
      )
      navigator.mediaSession.setActionHandler('nexttrack', () =>
        state().handleSetNextTrack()
      )
      navigator.mediaSession.setActionHandler('seekbackward', null)
      navigator.mediaSession.setActionHandler('seekforward', null)
    }

    const audio = playerRef.current
    registerHandlers()
    audio.addEventListener('play', registerHandlers)

    return () => {
      audio.removeEventListener('play', registerHandlers)
      navigator.mediaSession.setActionHandler('play', null)
      navigator.mediaSession.setActionHandler('pause', null)
      navigator.mediaSession.setActionHandler('stop', null)
      navigator.mediaSession.setActionHandler('previoustrack', null)
      navigator.mediaSession.setActionHandler('nexttrack', null)
    }
  }, [])

  // Tells the OS whether we are playing rather than letting it infer it.
  useEffect(() => {
    /* istanbul ignore next */
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = playing ? 'playing' : 'paused'
    }
  }, [playing])

  // Synchronises the redux progress state to the audioElement one.
  useInterval(
    () => {
      dispatch(playerSetProgress(playerRef.current.currentTime))
    },
    playing ? 900 : null
  )

  return {
    queue,
    playing,
    loading,
    showLoader,
    progress,
    duration,
    volume,
    shuffle,
    repeat,
    track,
    handleTogglePlayPause,
    handleSetProgress,
    handleSetVolume,
    handleSetPreviousTrack,
    handleSetNextTrack,
    handleToggleRepeat,
    handleToggleShuffle,
  }
}
