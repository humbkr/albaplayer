import React from 'react'
import PropTypes from 'prop-types'
import Button from 'modules/player/components/buttons/Button'

const ShuffleBtn = (props, context) => {
  const size = `${props.size}px`
  const color = props.enabled ? context.colorEnabled : context.color

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Button {...props}>
      <svg
        width={size}
        height={size}
        viewBox="138 23 19 14"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          id="RandomBtn"
          stroke="none"
          strokeWidth="1"
          fill="none"
          fillRule="evenodd"
          transform="translate(147.000000, 29.893617) scale(-1, 1) translate(-147.000000, -29.893617) translate(138.000000, 23.000000)"
        >
          <g
            id="Arrow-Top"
            transform="translate(9.000000, 6.148936) scale(-1, -1) translate(-9.000000, -6.148936) translate(0.000000, 0.212766)"
            fill={color}
          >
            <rect
              id="Rectangle"
              x="5.74468085"
              y="8.75884498"
              width="8.42553191"
              height="1.64680858"
            />
            <path
              d="M2.97165596,0.792575179 C2.80133561,0.258388343 3.07103657,0.0205747889 3.57244297,0.260634375 L3.86897867,0.402607507 C4.37110452,0.64301155 4.74637685,1.28459653 4.70589215,1.85362892 L4.03852507,11.2338014 L3.542177,10.9993707 C3.03253029,10.758659 2.67999589,10.1143427 2.75179077,9.56290502 C2.75179077,9.56290502 3.68618887,2.89872346 3.2562446,1.63927351 C2.82630033,0.37982355 2.97165596,0.792575179 2.97165596,0.792575179 Z"
              id="Rectangle-2"
              transform="translate(3.714344, 5.633966) rotate(-30.000000) translate(-3.714344, -5.633966)"
            />
            <path
              d="M15.0557786,8.82263453 C15.5530161,7.99499578 16.3540793,7.98647683 16.8564349,8.82263453 L17.4018117,9.73039986 C17.8990492,10.5580386 17.5273405,11.2289724 16.5549875,11.2289724 L15.3572259,11.2289724 C14.3923003,11.2289724 14.0080462,10.5665576 14.5104018,9.73039986 L15.0557786,8.82263453 Z"
              id="Triangle"
              transform="translate(15.955987, 9.443198) rotate(90.000000) translate(-15.955987, -9.443198)"
            />
          </g>
          <g
            id="Arrow-Bottom"
            transform="translate(9.000000, 7.680851) scale(-1, 1) translate(-9.000000, -7.680851) translate(0.000000, 1.744681)"
            fill={color}
          >
            <rect
              id="Rectangle"
              x="5.74468085"
              y="8.75884498"
              width="8.42553191"
              height="1.64680858"
            />
            <path
              d="M2.97165596,0.792575179 C2.80133561,0.258388343 3.07103657,0.0205747889 3.57244297,0.260634375 L3.86897867,0.402607507 C4.37110452,0.64301155 4.74637685,1.28459653 4.70589215,1.85362892 L4.03852507,11.2338014 L3.542177,10.9993707 C3.03253029,10.758659 2.67999589,10.1143427 2.75179077,9.56290502 C2.75179077,9.56290502 3.68618887,2.89872346 3.2562446,1.63927351 C2.82630033,0.37982355 2.97165596,0.792575179 2.97165596,0.792575179 Z"
              id="Rectangle-2"
              transform="translate(3.714344, 5.633966) rotate(-30.000000) translate(-3.714344, -5.633966)"
            />
            <path
              d="M15.0557786,8.82263453 C15.5530161,7.99499578 16.3540793,7.98647683 16.8564349,8.82263453 L17.4018117,9.73039986 C17.8990492,10.5580386 17.5273405,11.2289724 16.5549875,11.2289724 L15.3572259,11.2289724 C14.3923003,11.2289724 14.0080462,10.5665576 14.5104018,9.73039986 L15.0557786,8.82263453 Z"
              id="Triangle"
              transform="translate(15.955987, 9.443198) rotate(90.000000) translate(-15.955987, -9.443198)"
            />
          </g>
        </g>
      </svg>
    </Button>
  )
}
ShuffleBtn.propTypes = {
  enabled: PropTypes.bool,
  size: PropTypes.number,
}
ShuffleBtn.defaultProps = {
  enabled: false,
  size: 25,
}
ShuffleBtn.contextTypes = {
  color: PropTypes.string,
  colorEnabled: PropTypes.string,
}

export default ShuffleBtn
