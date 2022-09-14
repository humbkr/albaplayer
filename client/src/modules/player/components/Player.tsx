import React, { useCallback, useEffect, useMemo, useRef } from 'react'
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
import { constants as APIConstants } from 'api'
import { useInterval } from 'common/utils/useInterval'
import { PlayerPlaybackMode } from 'modules/player/utils'
import { playerSelector, queueSelector } from 'modules/player/store/selectors'

function getListeningVolume(volumeBarValue: number) {
  return volumeBarValue ** 2
}

function Player() {
  const dispatch = useAppDispatch()

  const player = useAppSelector(playerSelector)
  const queue = useAppSelector(queueSelector)

  const onPlay = useCallback(async () => {
    dispatch(playerTogglePlayPause(true))
    await playerRef.current?.play()
  }, [dispatch])

  const onPause = useCallback(async () => {
    dispatch(playerTogglePlayPause(false))
    await playerRef.current?.pause()
  }, [dispatch])

  const audioElement = useMemo(() => {
    const audioElement = document.createElement('audio')
    audioElement.volume = getListeningVolume(player.volume)

    // Playback callbacks.
    audioElement.onended = () => handleSetNextTrack(true)
    audioElement.onloadedmetadata = () =>
      dispatch(playerSetDuration(audioElement.duration))

    return audioElement
    // We want to set volume only at first load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  const playerRef = useRef(audioElement)

  const handleTogglePlayPause = useCallback(async () => {
    if (player.playing) {
      await onPause()
    } else {
      await onPlay()
    }
  }, [onPause, onPlay, player.playing])

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
    async (endOfTrack?: boolean) => {
      if (
        endOfTrack &&
        player.repeat === PlayerPlaybackMode.PLAYER_REPEAT_LOOP_ONE
      ) {
        // Play the same track again.
        playerRef.current.currentTime = 0
        await onPlay()
      } else {
        dispatch(setNextTrack(false))
      }
    },
    [dispatch, onPlay, player.repeat]
  )

  const handleToggleRepeat = () => {
    dispatch(playerToggleRepeat())
  }

  const handleToggleShuffle = () => {
    dispatch(playerToggleShuffle())
  }

  // Synchronises the audioElement state to redux state external changes.
  useEffect(() => {
    const isPlaying =
      !playerRef.current?.paused &&
      !playerRef.current?.ended &&
      0 < playerRef.current?.currentTime

    if (player.playing && !isPlaying) {
      playerRef.current?.play()
    } else if (!player.playing && isPlaying) {
      playerRef.current?.pause()
    }
  }, [player.playing])

  // Changes audioElement source when redux track changes.
  useEffect(() => {
    if (player.track) {
      playerRef.current.src = APIConstants.BACKEND_BASE_URL + player.track.src
      playerRef.current.load()

      /* istanbul ignore next */
      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: player.track?.title || 'unknown',
          artist: player.track?.artist?.name || 'unknown',
          album: player.track?.album?.title || 'unknown',
          artwork: [
            {
              src: APIConstants.BACKEND_BASE_URL + player.track?.cover,
              sizes: '512x512',
              type: 'image/png',
            },
          ],
        })
      }

      if (player.playing) {
        onPlay()
      }
    }

    dispatch(playerSetProgress(0))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, player.track])

  useEffect(() => {
    /* istanbul ignore next */
    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', () => onPlay())
      navigator.mediaSession.setActionHandler('pause', () => onPause())
      navigator.mediaSession.setActionHandler('stop', () => onPause())
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
  }, [handleSetNextTrack, handleSetPreviousTrack, onPause, onPlay])

  // Synchronises the redux progress state to the audioElement one.
  useInterval(
    () => {
      dispatch(playerSetProgress(playerRef.current.currentTime))
    },
    player.playing ? 900 : null
  )

  return (
    <PlayerWrapper>
      <TrackInfo track={player.track} onClick={handleTogglePlayPause} />
      <ProgressBar
        position={player.progress}
        duration={player.duration}
        seek={handleSetProgress}
      />
      <Controls
        playing={player.playing}
        shuffle={player.shuffle}
        repeat={player.repeat}
        volume={player.volume}
        setVolume={handleSetVolume}
        togglePlayPause={handleTogglePlayPause}
        toggleShuffle={handleToggleShuffle}
        toggleRepeat={handleToggleRepeat}
        skipToNext={handleSetNextTrack}
        skipToPrevious={handleSetPreviousTrack}
        hasPreviousTrack={!!queue.current}
        hasNextTrack={queue.current < queue.items.length - 1}
        hasTrack={!!player.track}
      />
    </PlayerWrapper>
  )
}

export default Player

const PlayerWrapper = styled.div`
  width: 100%;
`
