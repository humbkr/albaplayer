import React from 'react'
import styled, { useTheme } from 'styled-components'
import Icon from 'common/components/Icon'

type Props = {
  onClick?: (...args: any[]) => any
  icon: string
  className?: string
  disabled?: boolean
  size?: number
  testId?: string
}

function ActionButtonIcon({
  onClick,
  icon,
  className = '',
  disabled = false,
  size,
  testId = '',
}: Props) {
  const theme = useTheme()

  return (
    <Wrapper
      className={className}
      disabled={disabled}
      // @ts-ignore
      onClick={onClick}
      data-testid={testId}
    >
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
  transition: 0.2s ease-out;
  background-color: transparent;
  color: inherit;

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
