import React from 'react'
import styled, { useTheme } from 'styled-components'
import Icon from 'common/components/Icon'

type Props = React.HTMLProps<HTMLButtonElement> & {
  icon: string
  size?: number
  testId?: string
}

function ActionButtonIcon({
  onClick,
  icon,
  disabled = false,
  size,
  testId = '',
}: Props) {
  const theme = useTheme()

  return (
    <Wrapper disabled={disabled} onClick={onClick} data-testid={testId}>
      <Icon size={size || theme.buttons.iconSize}>{icon}</Icon>
    </Wrapper>
  )
}

export default ActionButtonIcon

const Wrapper = styled.button`
  padding: 10px;
  border: none;
  cursor: pointer;
  text-transform: uppercase;
  text-align: center;
  vertical-align: middle;
  transition: 0.15s ease-in-out;
  background-color: transparent;
  color: inherit;

  &:hover {
    color: ${(props) => props.theme.colors.elementHighlightFocus};
  }

  :disabled {
    cursor: default;
    color: ${(props) => props.theme.colors.disabled};
  }

  > * {
    display: inline-block;
    vertical-align: middle;
    color: inherit;
  }
`
