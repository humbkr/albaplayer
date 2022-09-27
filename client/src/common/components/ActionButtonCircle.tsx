import React from 'react'
import styled from 'styled-components'

type Props = {
  size?: number
  borderWidth?: number
  color?: string
  icon?: string
  backgroundColor?: string
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
  testId?: string
}

const ActionButtonCircle = ({
  size = 50,
  borderWidth = 1,
  color,
  icon = '',
  backgroundColor = 'transparent',
  onClick,
  testId,
}: Props) => (
  <ActionButtonCircleWrapper
    // @ts-ignore
    onClick={onClick}
    color={color}
    data-testid={testId}
    size={size}
  >
    {icon}
  </ActionButtonCircleWrapper>
)

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
  color: ${(props) => props.color || props.theme.buttons.colorLight};

  &:hover {
    border: 1px solid ${(props) => props.theme.buttons.colorHover};
    color: ${(props) => props.theme.buttons.colorHover};
  }

  // For icon.
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  font-size: 28px;
  //display: inline-block;
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
