import { FunctionComponent, SVGProps, useState } from 'react'
import ReactSlider from 'react-slider'
import styled from 'styled-components'
import { ReactComponent as MuteIcon } from '../assets/mute.svg'
import { ReactComponent as VolumeLowIcon } from '../assets/volume_low.svg'
import { ReactComponent as VolumeHighIcon } from '../assets/volume_high.svg'
import ControlButton from './ControlButton'

type Props = {
  volume: number
  setVolume: (value: number) => void
  forceOverlay?: boolean
}

function VolumeContainer({ volume, setVolume, forceOverlay }: Props) {
  const [mouseOverBox, setMouseOverBox] = useState(false)
  const [mutedVolume, setMutedVolume] = useState(0)

  const onMouseOver = () => {
    setMouseOverBox(true)
  }

  const onMouseOut = () => {
    setMouseOverBox(false)
  }

  const onSliderChange = (value: number) => {
    setVolume(value / 100)
  }

  const onClickMute = () => {
    if (volume > 0) {
      // Save current volume level.
      setMutedVolume(volume)
      // MuteButton player.
      setVolume(0)
    } else {
      // Set saved volume level back.
      setVolume(mutedVolume)
    }
  }

  const onClickMaxVolume = () => {
    setVolume(1)
  }

  let VolumeIcon: FunctionComponent<SVGProps<SVGSVGElement>> = MuteIcon
  if ((mouseOverBox && volume !== 0) || forceOverlay) {
    VolumeIcon = VolumeLowIcon
  } else if (volume > 0) {
    if (volume > 0.5) {
      VolumeIcon = VolumeHighIcon
    } else {
      VolumeIcon = VolumeLowIcon
    }
  }

  return (
    <VolumeContainerWrapper
      onMouseEnter={onMouseOver}
      onMouseLeave={onMouseOut}
    >
      <ControlButton onClick={onClickMute} size={28} noHoverEffect>
        <VolumeIcon />
      </ControlButton>
      <VolumeOverlay
        data-testid="volume-overlay"
        style={{
          width: mouseOverBox || forceOverlay ? '204px' : 0,
          opacity: mouseOverBox || forceOverlay ? 1 : 0,
        }}
      >
        <VolumeBarWrapper>
          <ReactSlider
            onSliderClick={onSliderChange}
            onChange={onSliderChange}
            value={volume * 100}
          />
        </VolumeBarWrapper>
        <VolumeOverlayEnd>
          <ControlButton onClick={onClickMaxVolume} size={28} noHoverEffect>
            <VolumeHighIcon />
          </ControlButton>
        </VolumeOverlayEnd>
      </VolumeOverlay>
    </VolumeContainerWrapper>
  )
}

export default VolumeContainer

const VolumeContainerWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  position: relative;
  padding: 0 10px;
`
const VolumeOverlay = styled.div`
  background-color: ${(props) => props.theme.colors.sidebarBackground};
  display: flex;
  align-items: center;
  top: 0;
  left: 0;
  position: absolute;
  transform: translate3d(47px, 0, 0);
  z-index: 20;
  // width is controlled by the component.
  width: 0;
  overflow: hidden;
  transition: opacity 0.2s;
`
const VolumeBarWrapper = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  padding-right: 10px;

  .slider {
    display: flex;
    align-items: center;
    width: 100%;
    cursor: pointer;

    .track {
      height: 4px;
      background-color: ${(props) => props.theme.colors.playerButtonDisabled};
    }

    .track-0 {
      background-color: ${(props) => props.theme.colors.playerTimelineElapsed};
    }

    .thumb {
      background-color: ${(props) => props.theme.colors.playerTimelineElapsed};
      height: 16px;
      width: 16px;
      border-radius: 50%;
    }
  }
`
const VolumeOverlayEnd = styled.div`
  svg polygon {
    fill: ${(props) => props.theme.colors.sidebarTextPrimary};
  }
`
