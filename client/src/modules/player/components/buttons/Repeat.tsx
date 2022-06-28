import React from 'react'
import { useTheme } from 'styled-components'

type Props = {
  size?: number
  active?: boolean
  repeatOne?: boolean
}

const Repeat = ({ size = 30, active = false, repeatOne = false }: Props) => {
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
      data-testid="player-repeat-icon"
    >
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
      {repeatOne && (
        <rect
          x="11.5"
          y="8.5"
          width="1"
          height="7"
          data-testid="player-repeat-icon-one"
        />
      )}
    </svg>
  )
}

export default Repeat
