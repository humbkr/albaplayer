import { useCallback, useEffect, useMemo, useRef } from 'react'
import styled from 'styled-components'
import TrackInfo from 'modules/player/components/TrackInfo'
import Controls from 'modules/player/components/Controls'
import ProgressBar from 'modules/player/components/ProgressBar'

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
import { useAppDispatch, useAppSelector } from 'store/hooks'
import APIConstants from 'api/constants'
import { useInterval } from 'common/utils/useInterval'
import { playerSelector, queueSelector } from 'modules/player/store/selectors'
import { PlayerPlaybackMode, setCycleNumPos } from 'modules/player/utils'
import { useTranslation } from 'react-i18next'

function getListeningVolume(volumeBarValue: number) {
  return volumeBarValue ** 2
}

// TODO https://stackoverflow.com/questions/48277432/load-html5-audio-from-dynamic-content-provider-with-authentication
function Player() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const { shuffle, repeat, volume, track, playing, progress, duration } =
    useAppSelector(playerSelector)
  const queue = useAppSelector(queueSelector)

  const onPlay = useCallback(async () => {
    dispatch(playerTogglePlayPause(true))
    await playerRef.current?.play()
  }, [dispatch])

  const onPause = useCallback(async () => {
    dispatch(playerTogglePlayPause(false))
    await playerRef.current?.pause()
  }, [dispatch])

  const onStop = useCallback(async () => {
    dispatch(playerTogglePlayPause(false))
    await playerRef.current?.pause()
    console.log('stopped by media session')
    console.log('seekable', playerRef.current?.seekable)
    console.log('buffered', playerRef.current?.buffered)
    console.log('error', playerRef.current?.error)
    console.log('networkState', playerRef.current?.networkState)
    console.log('readyState', playerRef.current?.readyState)
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
    // We need to update the audio element callback with the new repeat mode manually otherwise
    // the callback will keep its original repeat value.
    const nextRepeatMode = setCycleNumPos(repeat, 1, 3)
    playerRef.current.onended = () => handleSetNextTrack(true, nextRepeatMode)
    dispatch(playerToggleRepeat())
  }

  const handleToggleShuffle = () => {
    dispatch(playerToggleShuffle())
  }

  const audioElement = useMemo(() => {
    const audio = document.createElement('audio')
    audio.volume = getListeningVolume(volume)

    // Playback callbacks.
    audio.onended = () => handleSetNextTrack(true)
    audio.onloadedmetadata = () => dispatch(playerSetDuration(audio.duration))

    return audio
    // We want to set volume only at first load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, handleSetNextTrack])

  const playerRef = useRef(audioElement)

  // Synchronises the audioElement state to redux state external changes.
  useEffect(() => {
    const isPlaying =
      !playerRef.current?.paused &&
      !playerRef.current?.ended &&
      0 < playerRef.current?.currentTime

    if (playing && !isPlaying) {
      playerRef.current?.play()
    } else if (!playing && isPlaying) {
      playerRef.current?.pause()
    }
  }, [playing])

  // Changes audioElement source when redux track changes.
  useEffect(() => {
    if (track) {
      playerRef.current.src = APIConstants.BACKEND_BASE_URL + track.src
      playerRef.current.load()

      playerRef.current.onwaiting = () => {
        console.log('onwaiting')
        console.log('seekable', playerRef.current?.seekable)
        console.log('buffered', playerRef.current?.buffered)
        console.log('error', playerRef.current?.error)
        console.log('networkState', playerRef.current?.networkState)
        console.log('readyState', playerRef.current?.readyState)
      }
      playerRef.current.onerror = () => {
        console.log('onerror')
        console.log('seekable', playerRef.current?.seekable)
        console.log('buffered', playerRef.current?.buffered)
        console.log('error', playerRef.current?.error)
        console.log('networkState', playerRef.current?.networkState)
        console.log('readyState', playerRef.current?.readyState)
      }
      playerRef.current.oninvalid = () => {
        console.log('oninvalid')
        console.log('seekable', playerRef.current?.seekable)
        console.log('buffered', playerRef.current?.buffered)
        console.log('error', playerRef.current?.error)
        console.log('networkState', playerRef.current?.networkState)
        console.log('readyState', playerRef.current?.readyState)
      }
      playerRef.current.onsuspend = () => {
        console.log('onsuspend')
        console.log('seekable', playerRef.current?.seekable)
        console.log('buffered', playerRef.current?.buffered)
        console.log('error', playerRef.current?.error)
        console.log('networkState', playerRef.current?.networkState)
        console.log('readyState', playerRef.current?.readyState)
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

  return (
    <PlayerWrapper>
      <TrackInfo track={track} onClick={handleTogglePlayPause} />
      <ProgressBar
        position={progress}
        duration={duration}
        seek={handleSetProgress}
      />
      <Controls
        playing={playing}
        shuffle={shuffle}
        repeat={repeat}
        volume={volume}
        setVolume={handleSetVolume}
        togglePlayPause={handleTogglePlayPause}
        toggleShuffle={handleToggleShuffle}
        toggleRepeat={handleToggleRepeat}
        skipToNext={handleSetNextTrack}
        skipToPrevious={handleSetPreviousTrack}
        hasPreviousTrack={!!queue.current}
        hasNextTrack={queue.current < queue.items.length - 1}
        hasTrack={!!track}
      />
    </PlayerWrapper>
  )
}

export default Player

const PlayerWrapper = styled.div`
  width: 100%;
`
