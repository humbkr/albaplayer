import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { PlayerPlaybackMode } from 'modules/player/types'
import * as Buttons from './buttons'
import VolumeContainer from './VolumeContainer'

const Controls = ({
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
}) => {
  let PlayPauseButton
  switch (playing) {
    case true:
      PlayPauseButton = Buttons.PauseBtn
      break
    case false:
      PlayPauseButton = Buttons.PlayBtn
      break
    default:
      break
  }

  let RepeatButton
  let repeatButtonEnabled = false
  switch (repeat) {
    case PlayerPlaybackMode.PLAYER_REPEAT_NO_REPEAT:
      RepeatButton = Buttons.CycleBtn
      break
    case PlayerPlaybackMode.PLAYER_REPEAT_LOOP_ALL:
      RepeatButton = Buttons.CycleBtn
      repeatButtonEnabled = true
      break
    case PlayerPlaybackMode.PLAYER_REPEAT_LOOP_ONE:
      RepeatButton = Buttons.RepeatBtn
      repeatButtonEnabled = true
      break
    default:
      break
  }

  return (
    <ControlsWrapper>
      <ControlsPrimary>
        <Buttons.SkipPrevBtn onClick={skipToPrevious} />
        <PlayPauseButton onClick={() => togglePlayPause()} size={45} />
        <Buttons.SkipNextBtn onClick={skipToNext} />
      </ControlsPrimary>
      <ControlsSecondary>
        <div>
          <VolumeContainer volume={volume} setVolume={setVolume} />
        </div>
        <div>
          <RepeatButton onClick={toggleRepeat} enabled={repeatButtonEnabled} />
        </div>
        <div>
          <Buttons.ShuffleBtn onClick={toggleShuffle} enabled={shuffle} />
        </div>
        <div />
      </ControlsSecondary>
    </ControlsWrapper>
  )
}
Controls.propTypes = {
  playing: PropTypes.bool.isRequired,
  shuffle: PropTypes.bool.isRequired,
  repeat: PropTypes.number.isRequired,
  volume: PropTypes.number.isRequired,
  setVolume: PropTypes.func.isRequired,
  togglePlayPause: PropTypes.func.isRequired,
  toggleShuffle: PropTypes.func.isRequired,
  toggleRepeat: PropTypes.func.isRequired,
  skipToNext: PropTypes.func.isRequired,
  skipToPrevious: PropTypes.func.isRequired,
}

export default Controls

const ControlsWrapper = styled.div`
  margin: 10px 0;
`

const ControlsPrimary = styled.div`
  display: table;
  margin: 0 auto 15px;

  > * {
    display: table-cell;
    vertical-align: middle;
  }
`

const ControlsSecondary = styled.div`
  display: table;
  margin: 0 auto;
  width: 100%;

  > * {
    display: table-cell;
    vertical-align: middle;
    width: 25%;
    text-align: center;
  }
`
