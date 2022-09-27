import React, { FunctionComponent, SVGProps } from 'react'
import styled from 'styled-components'
import VolumeContainer from 'modules/player/components/VolumeContainer'
import { PlayerPlaybackMode } from '../utils'
import { ReactComponent as PlayIcon } from '../assets/play.svg'
import { ReactComponent as PauseIcon } from '../assets/pause.svg'
import { ReactComponent as PreviousIcon } from '../assets/previous.svg'
import { ReactComponent as NextIcon } from '../assets/next.svg'
import { ReactComponent as ShuffleIcon } from '../assets/shuffle.svg'
import { ReactComponent as RepeatAllIcon } from '../assets/repeat.svg'
import { ReactComponent as RepeatOneIcon } from '../assets/repeat_one.svg'
import ControlButton from './ControlButton'

type Props = {
  playing: boolean
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
          disabled={!hasTrack}
          testId={'play-pause-button'}
        >
          <PlayPauseIcon />
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
