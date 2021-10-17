import React from 'react'
import PropTypes from 'prop-types'
import ProgressBar from './ProgressBar'
import ProgressBarHandler from './ProgressBarHandler'

class Timeline extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showHandler: false,
      barWidth: props.appWidth,
      translate: 0,
    }

    this.holding = false
    this.shouldTogglePlayPause = this.props.playing
    this.onMouseMoveFunctionRef = null
  }

  // eslint-disable-next-line
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      !Number.isNaN(nextProps.duration)
      && nextProps.duration !== 0
      && !this.holding
    ) {
      const lengthPerSecond = this.state.barWidth / nextProps.duration
      const length = nextProps.progress * lengthPerSecond

      this.changeTranslate(length)
      this.shouldTogglePlayPause = nextProps.playing
    }
  }

  onMouseOverProgressBar = () => {
    this.setState({ showHandler: true })
  }

  onMouseOutProgressBar = () => {
    this.setState({ showHandler: false })
  }

  onMouseDownProgressBar = (e) => {
    e.stopPropagation()
    // Console.log('Timeline: onMouseDownProgressBar');
    if (this.shouldTogglePlayPause) {
      this.props.togglePlayPause()
    }
    const timelineDisToLeft = e.target.parentNode.getBoundingClientRect().left
    const newTranslate = e.pageX - timelineDisToLeft
    this.changeTranslate(newTranslate)
    this.holding = true
    this.onMouseMoveFunctionRef = this.onMouseMove(e.pageX, newTranslate)
    document.addEventListener('mousemove', this.onMouseMoveFunctionRef)
    document.addEventListener('mouseup', this.onMouseUp)
  }

  onMouseDownProgressBarHandler = (e) => {
    e.stopPropagation()
    this.holding = true
    // Console.log('Timeline: onMouseDownProgressBarHandler');
    if (this.shouldTogglePlayPause) {
      this.props.togglePlayPause()
    }
    this.onMouseMoveFunctionRef = this.onMouseMove(
      e.pageX,
      this.state.translate
    )
    document.addEventListener('mousemove', this.onMouseMoveFunctionRef)
    document.addEventListener('mouseup', this.onMouseUp)
  }

  onMouseMove = (mouseDownX, startTranslate) => (event) => {
    if (this.holding) {
      const translate = event.pageX - mouseDownX + startTranslate
      this.changeTranslate(translate)
    }
  }

  onMouseUp = () => {
    // Console.log('Timeline: onMouseUp()');
    /* When the onMouseUp() event happen really quick after the onMouseDownProgressBar(),
       i.e. React hasn't called setState, enqueue a togglePlayPause() to the loop. */
    if (this.shouldTogglePlayPause && this.props.playing) {
      setTimeout(() => this.props.togglePlayPause(), 0)
    }
    // Normally, when this.shouldTogglePlayPause is true, this.props.playing should be false,
    // except the case above.
    if (this.shouldTogglePlayPause && !this.props.playing) {
      this.props.togglePlayPause()
    }

    this.holding = false
    this.props.setProgress(
      (this.state.translate / this.state.barWidth) * this.props.duration
    )

    document.removeEventListener('mousemove', this.onMouseMoveFunctionRef)
    document.removeEventListener('mouseup', this.onMouseUp)
  }

  changeTranslate = (newTranslate) => {
    let translate = newTranslate
    const max = this.state.barWidth

    // Boundaries checks.
    if (translate < 0) {
      translate = 0
    }
    if (translate > max) {
      translate = max
    }

    this.setState({ translate })
  }

  render() {
    const handlerWidth = 12
    const handlerHeight = 12
    const containerWidth = this.state.barWidth
    const barHeight = 6

    return (
      <div style={{ width: containerWidth, transform: 'translateY(-9px)' }}>
        <ProgressBar
          width={containerWidth}
          height={handlerHeight}
          barHeight={barHeight}
          translate={this.state.translate}
          duration={this.props.duration}
          onMouseDown={this.onMouseDownProgressBar}
          onMouseOver={this.onMouseOverProgressBar}
          onMouseOut={this.onMouseOutProgressBar}
        >
          <ProgressBarHandler
            width={handlerWidth}
            height={handlerHeight}
            visibility={this.state.showHandler || this.holding}
            translate={`translate(${this.state.translate - 6})`}
            onMouseDown={this.onMouseDownProgressBarHandler}
          />
        </ProgressBar>
      </div>
    )
  }
}
Timeline.propTypes = {
  appWidth: PropTypes.number.isRequired,
  playing: PropTypes.bool.isRequired,
  duration: PropTypes.number.isRequired,
  progress: PropTypes.number.isRequired,
  togglePlayPause: PropTypes.func.isRequired,
  setProgress: PropTypes.func.isRequired,
}

export default Timeline
