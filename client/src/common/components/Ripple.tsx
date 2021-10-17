import React, { FunctionComponent, useRef } from 'react'
import ReactDOM from 'react-dom'
import styled, { keyframes } from 'styled-components'

const Ripple: FunctionComponent = (props) => {
  const ripple = useRef<HTMLElement | null>(null)
  const rippleContainer = useRef<HTMLElement | null>(null)

  const doTheRipple = (event: React.MouseEvent) => {
    const rippleSize = calculateRippleSize(rippleContainer.current)
    const ripplePosition = calculateRipplePosition(
      event,
      rippleContainer.current,
      rippleSize
    )

    renderRipple(ripple.current, rippleSize, ripplePosition)
  }

  const calculateRippleSize = (parent: HTMLElement | null): number => {
    if (parent) {
      const { offsetWidth, offsetHeight } = parent
      return offsetWidth >= offsetHeight ? offsetWidth : offsetHeight
    }

    return 0
  }

  const calculateRipplePosition = (
    event: React.MouseEvent,
    parent: HTMLElement | null,
    rippleSize: number
  ) => {
    if (parent) {
      const bounds = parent.getBoundingClientRect()
      const x = event.clientX - bounds.left - rippleSize / 2
      const y = event.clientY - bounds.top - rippleSize / 2

      return { x, y }
    }

    return { x: 0, y: 0 }
  }

  const renderRipple = (
    toNode: HTMLElement | null,
    size: number,
    position: { x: number; y: number }
  ) => {
    if (toNode) {
      ReactDOM.unmountComponentAtNode(toNode)
      ReactDOM.render(
        <RippleStyled
          style={{
            left: position.x,
            top: position.y,
            width: size,
            height: size,
          }}
        />,
        toNode
      )
    }
  }

  return (
    <RippleContainer
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      // @ts-ignore
      ref={rippleContainer}
      onClick={doTheRipple}
    >
      {props.children}
      <span ref={ripple} />
    </RippleContainer>
  )
}

export default Ripple

const RippleContainer = styled.div`
  display: inline-block;
  position: relative;
  overflow: hidden;
  transform: translate3d(0, 0, 0);
`
const rippleAnimation = keyframes`
  100% {
    transform: scale(2);
    opacity: 0;
  }
`
const RippleStyled = styled.span`
  width: 0;
  height: 0;
  opacity: 0.7;
  position: absolute;
  border-radius: 150%;
  background-color: #fff;
  transform: scale(0);
  cursor: inherit;
  user-select: none;
  display: inline-block;
  pointer-events: none;
  animation: ${rippleAnimation} 0.3s linear;
  z-index: 50;
`
