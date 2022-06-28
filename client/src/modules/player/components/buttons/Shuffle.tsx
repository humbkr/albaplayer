import React from 'react'
import { useTheme } from 'styled-components'

type Props = {
  size?: number
  active?: boolean
}

const Shuffle = ({ size = 30, active = false }: Props) => {
  const sizePx = `${size}px`
  const theme = useTheme() as AppTheme

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={sizePx}
      height={sizePx}
      viewBox="0 0 24 24"
      fill="none"
      stroke={
        active
          ? theme.player.buttons.options.colorEnabled
          : theme.player.buttons.options.colorDisabled
      }
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      data-testid="player-shuffle-icon"
    >
      <polyline points="16 3 21 3 21 8" />
      <line x1="4" y1="20" x2="21" y2="3" />
      <polyline points="21 16 21 21 16 21" />
      <line x1="15" y1="15" x2="21" y2="21" />
      <line x1="4" y1="4" x2="9" y2="9" />
    </svg>
  )
}

export default Shuffle
