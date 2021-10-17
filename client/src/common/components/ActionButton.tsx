import React, { FunctionComponent } from 'react'
import styled from 'styled-components'
import Icon from 'common/components/Icon'

const ActionButton: FunctionComponent<{
  onClick: (event: React.MouseEvent<HTMLButtonElement> | void) => void
  icon?: string
  raised?: boolean
  disabled?: boolean
  testId?: string
}> = ({
  onClick,
  icon = '',
  raised = false,
  disabled = false,
  testId,
  children,
}) => (
  <ActionButtonWrapper
    raised={raised}
    disabled={disabled}
    onClick={onClick}
    data-testid={testId}
  >
    {icon && <Icon>{icon}</Icon>}
    <span>{children}</span>
  </ActionButtonWrapper>
)

export default ActionButton

const ActionButtonWrapper = styled.button<{ raised: boolean }>`
  padding: 0 ${(props) => props.theme.buttons.sidePadding};
  font-size: ${(props) => props.theme.buttons.fontSize};
  border: none;
  cursor: pointer;
  text-transform: uppercase;
  text-align: center;
  vertical-align: middle;
  transition: 0.2s ease-out;
  color: ${(props) => props.theme.buttons.color};
  background-color: transparent;

  ${(props) => (props.raised
    ? `
    border-radius: 2px;
    background-color: ${props.theme.buttons.color};
    color: #fff;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14),0 1px 5px 0 rgba(0,0,0,0.12),0 3px 1px -2px rgba(0,0,0,0.2);
  `
    : '')} :hover {
    ${(props) => (props.raised
    ? `
      background-color: ${props.theme.buttons.colorHover};
    `
    : `color: ${props.theme.buttons.colorHover}`)};
  }

  :disabled {
    cursor: default;
    color: ${(props) => props.theme.buttons.colorDisabled};

    ${(props) => (props.raised
    ? `
      background-color: ${props.theme.buttons.colorDisabled};
      color: #fff;
  `
    : '')};
  }

  > * {
    display: inline-block;
    vertical-align: middle;
  }

  > span {
    height: ${(props) => props.theme.buttons.height};
    line-height: ${(props) => props.theme.buttons.height};
  }
`
