import React from 'react'
import { useTheme } from 'styled-components'

type Props = {
  size?: number
}

const Play = ({ size = 30 }: Props) => {
  const sizePx = `${size}px`
  const theme = useTheme() as AppTheme

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={sizePx}
      height={sizePx}
      viewBox="0 0 24 24"
      fill={`${theme.player.buttons.playback.colorEnabled}`}
      stroke={`${theme.player.buttons.playback.colorEnabled}`}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      data-testid="player-play-icon"
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  )
}

export default Play
