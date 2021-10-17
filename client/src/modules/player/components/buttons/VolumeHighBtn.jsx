import React from 'react'
import PropTypes from 'prop-types'
import Button from 'modules/player/components/buttons/Button'

const VolumeHighBtn = (props, context) => {
  const size = `${props.size}px`

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Button {...props}>
      <svg
        width={size}
        height={size}
        viewBox="168 22 17 16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          id="VolumeBtn"
          stroke="none"
          strokeWidth="1"
          fill="none"
          fillRule="evenodd"
          transform="translate(168.000000, 22.000000)"
        >
          <path
            d="M9.77777778,14.1180227 C12.3475556,13.3325731 14.2222222,10.8913849 14.2222222,7.99954387 C14.2222222,5.10861509 12.3475556,2.66742688 9.77777778,1.88197731 L9.77777778,0 C13.3395556,0.831062204 16,4.09327784 16,7.99954387 C16,11.9067222 13.3395556,15.16985 9.77777778,16 L9.77777778,14.1180227 Z M9.77777778,11.6740977 L9.77777778,4.32590227 C11.0933333,4.99914476 12,6.38941787 12,7.99954387 C12,9.61058213 11.0933333,11.0008552 9.77777778,11.6740977 Z M1.10550986,10.736302 C0.494953625,10.736302 0,10.2311777 0,9.62865429 L0,6.37043346 C0,5.75869655 0.494384766,5.26278579 1.10550986,5.26278579 L0.222415924,5.26278579 C2.06325811,5.26278579 4.59758031,4.19337216 5.88191054,2.87528424 L7.22583686,1.49603378 C7.65339536,1.05723722 8,1.20395116 8,1.82261332 L8,14.1764744 C8,14.7956359 7.6512519,14.9396507 7.22583686,14.503054 L5.88191054,13.1238035 C4.59710016,11.8052228 2.06828139,10.736302 0.222415924,10.736302 L1.10550986,10.736302 Z"
            id="ic_sound"
            fill={`${context.color}`}
          />
        </g>
      </svg>
    </Button>
  )
}
VolumeHighBtn.propTypes = {
  size: PropTypes.number,
}
VolumeHighBtn.defaultProps = {
  size: 25,
}
VolumeHighBtn.contextTypes = {
  color: PropTypes.string,
}

export default VolumeHighBtn
