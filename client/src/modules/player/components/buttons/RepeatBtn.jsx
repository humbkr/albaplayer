import React from 'react'
import PropTypes from 'prop-types'
import Button from 'modules/player/components/buttons/Button'

const RepeatBtn = (props, context) => {
  const size = `${props.size}px`
  const color = props.enabled ? context.colorEnabled : context.color

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Button {...props}>
      <svg
        width={size}
        height={size}
        viewBox="138 22 18 17"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          id="RepeatBtn"
          stroke="none"
          strokeWidth="1"
          fill="none"
          fillRule="evenodd"
          transform="translate(147.000000, 30.500000) scale(-1, 1) translate(-147.000000, -30.500000) translate(138.000000, 23.000000)"
        >
          <g id="Arrow-Top" fill={color}>
            <path
              d="M14.4475396,1.57009921 C14.9393902,0.751426771 15.7407446,0.757929722 16.2286883,1.57009921 L16.9535295,2.77657829 C17.4453801,3.59525073 17.060982,4.25891587 16.1052225,4.25891587 L14.5710054,4.25891587 C13.6106478,4.25891587 13.2347547,3.58874778 13.7226984,2.77657829 L14.4475396,1.57009921 Z"
              id="Triangle"
              transform="translate(15.337986, 2.351384) rotate(90.000000) translate(-15.337986, -2.351384)"
            />
            <rect
              id="Rectangle"
              x="1.3685982"
              y="1.63636364"
              width="12.2727273"
              height="1.63636364"
            />
            <rect
              id="Rectangle-Copy"
              transform="translate(0.712399, 5.905138) rotate(90.000000) translate(-0.712399, -5.905138) "
              x="-3.55637612"
              y="5.19461202"
              width="8.53754941"
              height="1.42105263"
            />
          </g>
          <g
            id="Arrow-Bottom"
            transform="translate(9.204545, 9.204545) scale(-1, -1) translate(-9.204545, -9.204545) translate(0.409091, 4.090909)"
            fill={color}
          >
            <path
              d="M14.4475396,1.57009921 C14.9393902,0.751426771 15.7407446,0.757929722 16.2286883,1.57009921 L16.9535295,2.77657829 C17.4453801,3.59525073 17.060982,4.25891587 16.1052225,4.25891587 L14.5710054,4.25891587 C13.6106478,4.25891587 13.2347547,3.58874778 13.7226984,2.77657829 L14.4475396,1.57009921 Z"
              id="Triangle"
              transform="translate(15.337986, 2.351384) rotate(90.000000) translate(-15.337986, -2.351384)"
            />
            <rect
              id="Rectangle"
              x="1.3685982"
              y="1.63636364"
              width="12.2727273"
              height="1.63636364"
            />
            <rect
              id="Rectangle-Copy"
              transform="translate(0.712399, 5.905138) rotate(90.000000) translate(-0.712399, -5.905138) "
              x="-3.55637612"
              y="5.19461202"
              width="8.53754941"
              height="1.42105263"
            />
          </g>
          <text
            id="1"
            transform="translate(9.500000, 7.500000) scale(-1, 1) translate(-9.500000, -7.500000) "
            fontFamily="Roboto-Bold, Roboto"
            fontSize="7.5"
            fontWeight="bold"
            fill={color}
          >
            <tspan x="8" y="10">
              1
            </tspan>
          </text>
        </g>
      </svg>
    </Button>
  )
}
RepeatBtn.propTypes = {
  enabled: PropTypes.bool,
  size: PropTypes.number,
}
RepeatBtn.defaultProps = {
  enabled: false,
  size: 25,
}
RepeatBtn.contextTypes = {
  color: PropTypes.string,
  colorEnabled: PropTypes.string,
}

export default RepeatBtn
