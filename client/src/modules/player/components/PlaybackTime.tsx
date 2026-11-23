import type React from 'react'
import styled, { css } from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { formatDuration } from 'common/utils/utils'
import {
  SETTINGS_PLAYER_TIME_DISPLAY,
  SETTINGS_PLAYER_TIME_VISIBILITY,
} from 'modules/settings/constants'
import {
  selectUserConfig,
  updatePlayerConfig,
} from 'modules/settings/userConfig'

type Props = {
  // In seconds.
  position: number
  // In seconds.
  duration: number
  isProgressBarHovered?: boolean
}

function PlaybackTime({
  position,
  duration,
  isProgressBarHovered = false,
}: Props) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { timeDisplay, timeVisibility } = useAppSelector(
    (state) => selectUserConfig(state).player
  )

  // Unknown until the track metadata is loaded.
  const total = Number.isFinite(duration) ? Math.floor(duration) : 0
  if (total <= 0 || timeVisibility === SETTINGS_PLAYER_TIME_VISIBILITY.never) {
    return null
  }

  const isHidden =
    timeVisibility === SETTINGS_PLAYER_TIME_VISIBILITY.progressBarHover &&
    !isProgressBarHovered

  const elapsed = Math.min(Math.floor(position), total)
  const isRemaining = timeDisplay === SETTINGS_PLAYER_TIME_DISPLAY.remaining

  const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // The track info toggles playback when clicked.
    event.stopPropagation()
    dispatch(
      updatePlayerConfig({
        timeDisplay: isRemaining
          ? SETTINGS_PLAYER_TIME_DISPLAY.elapsed
          : SETTINGS_PLAYER_TIME_DISPLAY.remaining,
      })
    )
  }

  return (
    <TimeButton
      type="button"
      isHidden={isHidden}
      onClick={onClick}
      aria-label={t('player.toggleTimeDisplay')}
      data-testid="player-playback-time"
    >
      {isRemaining
        ? `-${formatDuration(total - elapsed)}`
        : `${formatDuration(elapsed)} / ${formatDuration(total)}`}
    </TimeButton>
  )
}

export default PlaybackTime

const TimeButton = styled.button<{ isHidden: boolean }>`
  position: absolute;
  right: 10px;
  bottom: 10px;
  z-index: 15;
  padding: 0;
  border: none;
  background: none;
  font-size: 0.8em;
  font-variant-numeric: tabular-nums;
  letter-spacing: 1px;
  color: #fff;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.2s ease;

  ${(props) =>
    props.isHidden &&
    css`
      opacity: 0;
      visibility: hidden;
      // Stay hoverable for a moment so the cursor can travel from the progress
      // bar to the time, which then stays displayed while hovered.
      transition:
        opacity 0.2s ease 0.3s,
        visibility 0s linear 0.5s;

      &:hover {
        opacity: 0.8;
        visibility: visible;
        transition: none;
      }
    `}
`
