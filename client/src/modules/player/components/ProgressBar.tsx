import { useState } from 'react'
import styled from 'styled-components'
import ReactSlider from 'react-slider'

type Props = {
  position: number
  duration: number
  seek: (position: number) => void
}

function ProgressBar({ position, duration, seek }: Props) {
  const [mouseHoverBox, setMouseHoverBox] = useState(false)

  const onMouseEnter = () => {
    setMouseHoverBox(true)
  }

  const onMouseLeave = () => {
    setMouseHoverBox(false)
  }

  return (
    <Container
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      isMouseHover={mouseHoverBox}
      aria-label="Progress bar"
      data-testid="player-progress-bar"
    >
      <ReactSlider
        onSliderClick={seek}
        onAfterChange={seek}
        value={position}
        max={duration}
      />
    </Container>
  )
}

export default ProgressBar

interface ContainerProps {
  readonly isMouseHover: boolean;
}

const Container = styled.div<ContainerProps>`
  width: 100%;
  height: 16px;
  transform: translateY(-9px);
  display: flex;
  align-items: center;

  .slider {
    display: flex;
    align-items: center;
    width: 100%;
    cursor: pointer;

    .track {
      height: 6px;
      background-color: ${(props) => props.theme.player.timeline.color};
    }

    .track-0 {
      background-color: ${(props) => props.theme.player.timeline.colorElapsed};
    }

    .thumb {
      background-color: ${(props) =>
        props.isMouseHover
          ? props.theme.player.timeline.colorElapsed
          : 'transparent'};
      height: 16px;
      width: 4px;
      border-radius: 1px;
      margin-left: -2px;
    }
  }
`
