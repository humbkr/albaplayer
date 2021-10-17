import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Motion, spring } from 'react-motion'
import * as Buttons from 'modules/player/components/buttons'
import ProgressBarHandler from './ProgressBarHandler'
import VolumeBar from './VolumeBar'

function audioPlayerVolumeToVisualVolume(audioPlayerVolume) {
  // So, why the fuck 1.48? Because that's the magic number that makes
  // the far left coordinate of the volume bar the 0 volume level, and the
  // far right coordinate the 100 volume level.
  // Also, we get the volume from the state as a number between 0 and 1,
  // so we have to multiply it by 100 to match the translate properties.
  return audioPlayerVolume * 100 * 1.48
}
function visualVolumeToAudioPlayerVolume(audioPlayerVolume) {
  // So, why the fuck 1.48? Because that's the magic number that makes
  // the far left coordinate of the volume bar the 0 volume level, and the
  // far right coordinate the 100 volume level.
  return Math.round(audioPlayerVolume / 1.48) / 100
}

class VolumeContainer extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      mouseOverBox: false,
      translate: audioPlayerVolumeToVisualVolume(props.volume),
      volume: props.volume,
      mutedVolume: 0,
    }

    this.handlerWidth = 12
    this.handlerHeight = 12
    this.svgWidth = 160
    this.svgHeight = 12
    this.volumeThickness = 4

    this.holding = false
    this.onClick = this.onClick.bind(this)
    this.onClickMute = this.onClickMute.bind(this)
    this.onMouseDown = this.onMouseDown.bind(this)
    this.onMouseDragging = this.onMouseDragging.bind(this)
    this.onMouseOver = this.onMouseOver.bind(this)
    this.onMouseOut = this.onMouseOut.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)

    this.onDraggingFunctionRef = null
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!this.holding) {
      this.setState({
        translate: audioPlayerVolumeToVisualVolume(nextProps.volume),
        volume: nextProps.volume,
      })
    }
  }

  onClick(e) {
    const newVolume = visualVolumeToAudioPlayerVolume(
      e.clientX - e.target.getBoundingClientRect().left
    )
    if (newVolume < 1) {
      this.props.setVolume(newVolume)
    }
  }

  onMouseDown(e) {
    this.holding = true
    if (document.onmousemove) {
      this.onmousemoveSaver = document.onmousemove
    }
    if (document.onmouseup) {
      this.onmouseupSaver = document.onmouseup
    }
    this.onDraggingFunctionRef = this.onMouseDragging(
      e.clientX,
      this.state.translate
    )
    document.addEventListener('mousemove', this.onDraggingFunctionRef)
    document.addEventListener('mouseup', this.onMouseUp)
  }

  onMouseDragging(mouseDownX, startTranslate) {
    return (e) => {
      if (this.holding) {
        let newTranslate = e.clientX - mouseDownX + startTranslate

        // Borders checks.
        if (newTranslate < 0) {
          newTranslate = 0
        }
        if (newTranslate > this.svgWidth - this.handlerWidth) {
          newTranslate = this.svgWidth - this.handlerWidth
        }

        this.setState({
          translate: newTranslate,
          volume: visualVolumeToAudioPlayerVolume(newTranslate),
        })
        this.props.setVolume(this.state.volume)
      }
    }
  }

  onMouseOver() {
    this.setState({ mouseOverBox: true })
  }

  onMouseOut() {
    this.setState({ mouseOverBox: false })
  }

  onClickMute() {
    if (this.state.volume > 0) {
      // Save current volume level.
      this.setState((prevState) => ({ mutedVolume: prevState.volume }))
      // Mute player.
      this.props.setVolume(0)
    } else {
      // Set saved volume level back.
      this.props.setVolume(this.state.mutedVolume)
    }
  }

  onMouseUp() {
    this.holding = false
    this.props.setVolume(this.state.volume)
    document.removeEventListener('mousemove', this.onDraggingFunctionRef)
    document.removeEventListener('mouseup', this.onMouseUp)
  }

  render() {
    let VolumeButton
    if (this.state.volume === 0) {
      VolumeButton = Buttons.VolumeMutedBtn
    } else if (this.state.mouseOverBox) {
      VolumeButton = Buttons.VolumeLowBtn
    } else if (this.state.volume > 0) {
      if (this.state.volume > 0.5) {
        VolumeButton = Buttons.VolumeHighBtn
      } else {
        VolumeButton = Buttons.VolumeLowBtn
      }
    }

    return (
      <VolumeContainerWrapper
        onMouseEnter={this.onMouseOver}
        onMouseLeave={this.onMouseOut}
      >
        <VolumeButton onClick={this.onClickMute} />
        <Motion
          style={{
            w: this.state.mouseOverBox || this.holding ? 208 : 0,
            opacity: spring(this.state.mouseOverBox ? 1 : 0),
          }}
        >
          {({ w, opacity }) => (
            <VolumeOverlay
              style={{
                width: `${w}px`,
                opacity,
              }}
            >
              <VolumeBarWrapper>
                <VolumeBar
                  width={this.svgWidth}
                  height={this.svgHeight}
                  barThickness={this.volumeThickness}
                  handlerWidth={this.handlerWidth * (105 / 80)}
                  translate={this.state.translate}
                  onClick={this.onClick}
                >
                  <ProgressBarHandler
                    width={this.handlerWidth}
                    height={this.handlerHeight}
                    visibility
                    translate={`translate(${this.state.translate}, 0)`}
                    onMouseDown={this.onMouseDown}
                  />
                </VolumeBar>
              </VolumeBarWrapper>
              <VolumeOverlayEnd>
                <Buttons.VolumeHighBtn />
              </VolumeOverlayEnd>
            </VolumeOverlay>
          )}
        </Motion>
      </VolumeContainerWrapper>
    )
  }
}
VolumeContainer.propTypes = {
  volume: PropTypes.number.isRequired,
  setVolume: PropTypes.func.isRequired,
}

export default VolumeContainer

const VolumeContainerWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  position: relative;
  height: 40px;
`
const VolumeOverlay = styled.div`
  background-color: ${(props) => props.theme.sidebar.background};
  display: flex;
  align-items: center;
  top: 0;
  left: 0;
  position: absolute;
  transform: translate3d(58px, 0, 0);
  z-index: 20;
  height: 40px;
  // width is controlled by the component.
  width: 0;
  overflow: hidden;
`
const VolumeBarWrapper = styled.div`
  flex: 1 1 auto;
  height: 40px;
  align-items: center;

  > * {
    display: block;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
  }
`
const VolumeOverlayEnd = styled.div`
  flex: 0 0 auto;
  height: 40px;
  width: 45px;

  > * {
    display: block;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
  }
`
