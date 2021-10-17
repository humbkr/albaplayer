import React from 'react'
import PropTypes from 'prop-types'

const VolumeBar = (
  {
    width, height, barThickness, handlerWidth, translate, onClick, children,
  },
  { color }
) => {
  const diff = (height - barThickness) / 2
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    >
      <g onClick={onClick}>
        <rect
          x={handlerWidth / 2}
          y={diff}
          width={width - handlerWidth}
          height={barThickness}
          fill={color}
        />
        <rect
          x={handlerWidth / 2}
          y={diff}
          width={translate}
          height={barThickness}
          fill="#E0E0E0"
        />
      </g>
      {children}
    </svg>
  )
}
VolumeBar.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  handlerWidth: PropTypes.number.isRequired,
  barThickness: PropTypes.number.isRequired,
  translate: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.element.isRequired,
}
VolumeBar.contextTypes = {
  color: PropTypes.string,
}

export default VolumeBar
