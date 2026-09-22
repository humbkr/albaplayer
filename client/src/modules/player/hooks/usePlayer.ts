import { useAppDispatch, useAppSelector } from 'store/hooks'
import { playerSelector, queueSelector } from 'modules/player/store/selectors'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import {
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
import { useTranslation } from 'react-i18next'

function getListeningVolume(volumeBarValue: number) {
  return volumeBarValue ** 2
}

const STALL_RECOVERY_DELAY_MS = 10_000
const MAX_RECOVERY_ATTEMPTS = 3

// TODO https://stackoverflow.com/questions/48277432/load-html5-audio-from-dynamic-content-provider-with-authentication
export default function usePlayer() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const { shuffle, repeat, volume, track, playing, progress, duration } =
    useAppSelector(playerSelector)
  const queue = useAppSelector(queueSelector)

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

  // Keep a ref to handleSetNextTrack so the audio element's onended callback
  // always calls the latest version without recreating the element.
  const handleSetNextTrackRef = useRef(handleSetNextTrack)
  handleSetNextTrackRef.current = handleSetNextTrack

  const handleToggleRepeat = () => {
    dispatch(playerToggleRepeat())
  }

  const handleToggleShuffle = () => {
    dispatch(playerToggleShuffle())
  }

  const audioElement = useMemo(() => {
    const audio = document.createElement('audio')
    audio.volume = getListeningVolume(volume)

    audio.onended = () => handleSetNextTrackRef.current(true)
    audio.onloadedmetadata = () => dispatch(playerSetDuration(audio.duration))

    return audio
    // Audio element is created once. Volume is only set at first load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const playerRef = useRef(audioElement)

  // Stall recovery state.
  const stallTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const recoveryAttemptsRef = useRef(0)

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

    stallTimeoutRef.current = setTimeout(() => {
      if (
        !audio.paused &&
        audio.readyState < HTMLMediaElement.HAVE_FUTURE_DATA
      ) {
        recoveryAttemptsRef.current += 1
        // Force re-buffering from the current position.
        // eslint-disable-next-line no-self-assign
        audio.currentTime = audio.currentTime
        audio.play().catch(() => {
          dispatch(playerTogglePlayPause(false))
        })
      }
    }, STALL_RECOVERY_DELAY_MS)
  }, [clearStallRecovery, dispatch])

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
    if (track) {
      playerRef.current.src = APIConstants.BACKEND_BASE_URL + track.src
      playerRef.current.load()

      // Reset recovery state for new track.
      recoveryAttemptsRef.current = 0
      clearStallRecovery()

      // Recovery handlers: schedule re-buffering if audio stalls too long.
      playerRef.current.onwaiting = () => scheduleStallRecovery()
      playerRef.current.onstalled = () => scheduleStallRecovery()
      playerRef.current.onplaying = () => {
        clearStallRecovery()
        recoveryAttemptsRef.current = 0
      }
      playerRef.current.onerror = () => {
        clearStallRecovery()
        dispatch(playerTogglePlayPause(false))
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, track])

  // Cleanup stall recovery timeout on unmount.
  useEffect(() => {
    return () => clearStallRecovery()
  }, [clearStallRecovery])

  useEffect(() => {
    /* istanbul ignore next */
    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', () => onPlay())
      navigator.mediaSession.setActionHandler('pause', () => onPause())
      navigator.mediaSession.setActionHandler('stop', () => onStop())
      navigator.mediaSession.setActionHandler('previoustrack', () =>
        handleSetPreviousTrack()
      )
      navigator.mediaSession.setActionHandler('nexttrack', () =>
        handleSetNextTrack()
      )
      navigator.mediaSession.setActionHandler('seekbackward', null)
      navigator.mediaSession.setActionHandler('seekforward', null)
    }

    return () => {
      /* istanbul ignore next */
      if ('mediaSession' in navigator) {
        navigator.mediaSession.setActionHandler('play', null)
        navigator.mediaSession.setActionHandler('pause', null)
        navigator.mediaSession.setActionHandler('stop', null)
        navigator.mediaSession.setActionHandler('previoustrack', null)
        navigator.mediaSession.setActionHandler('nexttrack', null)
      }
    }
  }, [handleSetNextTrack, handleSetPreviousTrack, onPause, onPlay, onStop])

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
