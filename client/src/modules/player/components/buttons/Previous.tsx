import React from 'react'
import { useTheme } from 'styled-components'

type Props = {
  size?: number
  enabled?: boolean
}

const Previous = ({ size = 30, enabled = true }: Props) => {
  const sizePx = `${size}px`
  const theme = useTheme() as AppTheme

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={sizePx}
      height={sizePx}
      viewBox="0 0 24 24"
      fill={
        enabled
          ? theme.player.buttons.playback.colorEnabled
          : theme.player.buttons.playback.colorDisabled
      }
      stroke={
        enabled
          ? theme.player.buttons.playback.colorEnabled
          : theme.player.buttons.playback.colorDisabled
      }
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      data-testid="player-previous-icon"
    >
      <polygon points="19 20 9 12 19 4 19 20" />
      <rect x="5" y="5" width="2" height="14" />
    </svg>
  )
}

export default Previous
