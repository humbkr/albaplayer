import styled, { keyframes } from 'styled-components'

type Props = {
  // Same size as the icon it replaces, so the button keeps its dimensions and
  // the spinner sits exactly where the icon was.
  size: number
}

function LoadingSpinner({ size }: Props) {
  return <Spinner size={size} data-testid="player-loading-spinner" />
}

export default LoadingSpinner

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`

const Spinner = styled.div<Props>`
  flex-shrink: 0;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  /* Matches the icons' stroke: 2 units in a 24 units viewBox. */
  border: ${(props) => Math.max(2, Math.round(props.size / 12))}px solid
    ${(props) => props.theme.player.buttons.colorDisabled};
  border-top-color: ${(props) => props.theme.player.buttons.color};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`
