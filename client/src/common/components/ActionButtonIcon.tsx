import React from 'react'
import styled, { withTheme } from 'styled-components'
import Icon from 'common/components/Icon'

type Props = {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
  icon: string
  theme: AppTheme
  className?: string
  disabled?: boolean
  size?: number
  testId?: string
}

function ActionButtonIcon({
  onClick,
  icon,
  theme,
  className = '',
  disabled = false,
  size,
  testId = '',
}: Props) {
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

export default withTheme(ActionButtonIcon)

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
    color: ${(props) => props.theme.buttons.colorDisabled};
  }

  > * {
    display: inline-block;
    vertical-align: middle;
    color: inherit;
  }
`
