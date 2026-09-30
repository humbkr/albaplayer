import type { FunctionComponent, SVGProps } from 'react'
import styled, { keyframes } from 'styled-components'
import VolumeContainer from 'modules/player/components/VolumeContainer'
import { PlayerPlaybackMode } from '../utils'
import PlayIcon from '../assets/play.svg?react'
import PauseIcon from '../assets/pause.svg?react'
import PreviousIcon from '../assets/previous.svg?react'
import NextIcon from '../assets/next.svg?react'
import ShuffleIcon from '../assets/shuffle.svg?react'
import RepeatAllIcon from '../assets/repeat.svg?react'
import RepeatOneIcon from '../assets/repeat_one.svg?react'
import ControlButton from './ControlButton'

type Props = {
  playing: boolean
  loading: boolean
  shuffle: boolean
  repeat: PlayerPlaybackMode
  volume: number
  setVolume: (value: number) => void
  togglePlayPause: () => void
  toggleShuffle: () => void
  toggleRepeat: () => void
  skipToNext: (endOfTrack: boolean) => void
  skipToPrevious: () => void
  hasTrack: boolean
  hasPreviousTrack: boolean
  hasNextTrack: boolean
}

function Controls({
  playing,
  loading,
  togglePlayPause,
  shuffle,
  toggleShuffle,
  repeat,
  toggleRepeat,
  volume,
  setVolume,
  skipToNext,
  skipToPrevious,
  hasTrack,
  hasPreviousTrack,
  hasNextTrack,
}: Props) {
  const onSkipToNext = () => {
    skipToNext(false)
  }

  let PlayPauseIcon: FunctionComponent<SVGProps<SVGSVGElement>>
  switch (playing) {
    case true:
      PlayPauseIcon = PauseIcon
      break
    case false:
    default:
      PlayPauseIcon = PlayIcon
  }

  let RepeatIcon: FunctionComponent<SVGProps<SVGSVGElement>>
  let repeatButtonEnabled = false
  switch (repeat) {
    case PlayerPlaybackMode.PLAYER_REPEAT_LOOP_ALL:
      RepeatIcon = RepeatAllIcon
      repeatButtonEnabled = true
      break
    case PlayerPlaybackMode.PLAYER_REPEAT_LOOP_ONE:
      RepeatIcon = RepeatOneIcon
      repeatButtonEnabled = true
      break
    case PlayerPlaybackMode.PLAYER_REPEAT_NO_REPEAT:
    default:
      RepeatIcon = RepeatAllIcon
  }

  return (
    <ControlsWrapper data-testid="player-controls">
      <ControlsPrimary>
        <ControlButton
          onClick={skipToPrevious}
          size={30}
          disabled={
            !hasTrack ||
            (!hasPreviousTrack &&
              repeat !== PlayerPlaybackMode.PLAYER_REPEAT_LOOP_ALL)
          }
          testId={'previous-button'}
        >
          <PreviousIcon />
        </ControlButton>
        <ControlButton
          onClick={() => togglePlayPause()}
          size={50}
          disabled={!hasTrack || loading}
          testId={'play-pause-button'}
        >
          {loading ? (
            <Spinner size={50} data-testid="player-loading-spinner" />
          ) : (
            <PlayPauseIcon />
          )}
        </ControlButton>
        <ControlButton
          onClick={onSkipToNext}
          size={30}
          disabled={
            !hasTrack ||
            (!hasNextTrack &&
              repeat !== PlayerPlaybackMode.PLAYER_REPEAT_LOOP_ALL)
          }
          testId={'next-button'}
        >
          <NextIcon />
        </ControlButton>
      </ControlsPrimary>
      <ControlsSecondary>
        <div>
          <VolumeContainer volume={volume} setVolume={setVolume} />
        </div>
        <div>
          <ControlButton
            onClick={toggleRepeat}
            active={repeatButtonEnabled}
            noHoverEffect
            testId={`repeat-button-${
              repeatButtonEnabled ? 'active' : 'inactive'
            }`}
          >
            <RepeatIcon />
          </ControlButton>
        </div>
        <div>
          <ControlButton
            onClick={toggleShuffle}
            active={shuffle}
            noHoverEffect
            testId={`shuffle-button-${shuffle ? 'active' : 'inactive'}`}
          >
            <ShuffleIcon />
          </ControlButton>
        </div>
        <div />
      </ControlsSecondary>
    </ControlsWrapper>
  )
}

export default Controls

const ControlsWrapper = styled.div`
  margin: 10px 0;
`

const ControlsPrimary = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-bottom: 20px;
`

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`

const Spinner = styled.div<{ size: number }>`
  width: ${(props) => props.size * 0.5}px;
  height: ${(props) => props.size * 0.5}px;
  border: 3px solid ${(props) => props.theme.player.buttons.colorDisabled};
  border-top-color: ${(props) => props.theme.player.buttons.color};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`

const ControlsSecondary = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 0.25fr);
  width: 100%;

  > * {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`
