import React from 'react'
import styled from 'styled-components'

type Props = React.HTMLProps<HTMLButtonElement> & {
  size?: number
  color?: string
  icon?: string
  testId?: string
}

function ActionButtonCircle({
  size = 50,
  color,
  icon = '',
  onClick,
  testId,
}: Props) {
  return (
    <ActionButtonCircleWrapper
      onClick={onClick}
      color={color}
      data-testid={testId}
      size={size}
    >
      {icon}
    </ActionButtonCircleWrapper>
  )
}

export default ActionButtonCircle

const ActionButtonCircleWrapper = styled.button<{
  size: number
  color?: string
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  border: 1px solid ${(props) => props.color};
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  color: ${(props) => props.color || props.theme.colors.buttonText};
  transition: 0.15s ease-in-out;

  &:hover {
    border: 1px solid ${(props) => props.theme.colors.elementHighlightFocus};
    color: ${(props) => props.theme.colors.elementHighlightFocus};
  }

  // For icon.
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  font-size: 28px;
  line-height: 1;
  text-transform: none;
  letter-spacing: normal;
  word-wrap: normal;
  white-space: nowrap;
  direction: ltr;

  /* Support for all WebKit browsers. */
  -webkit-font-smoothing: antialiased;
  /* Support for Safari and Chrome. */
  text-rendering: optimizeLegibility;

  /* Support for Firefox. */
  -moz-osx-font-smoothing: grayscale;

  /* Support for IE. */
  font-feature-settings: 'liga';
`
