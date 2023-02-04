import React from 'react'
import styled from 'styled-components'
import Icon from 'common/components/Icon'
import LoaderPulse from 'common/components/LoaderPulse'

type Props = React.HTMLProps<HTMLButtonElement> & {
  type?: 'button' | 'submit' | 'reset'
  icon?: string
  raised?: boolean
  testId?: string
  loading?: boolean
  children?: React.ReactNode
}

function ActionButton({
  type = 'button',
  onClick,
  icon = '',
  raised = false,
  disabled = false,
  testId,
  loading = false,
  children,
}: Props) {
  return (
    <ActionButtonWrapper
      type={type}
      raised={raised}
      disabled={disabled}
      onClick={onClick}
      data-testid={testId}
    >
      {loading && <LoaderPulse size={20} />}
      {!loading && icon && <Icon>{icon}</Icon>}
      <span>{children}</span>
    </ActionButtonWrapper>
  )
}

export default ActionButton

const ActionButtonWrapper = styled.button<{ raised: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background-color: transparent;
  color: ${(props) => props.theme.buttons.backgroundColor};
  height: ${(props) => props.theme.buttons.height};
  padding: ${(props) => props.theme.buttons.padding};
  font-size: ${(props) => props.theme.buttons.fontSize};
  letter-spacing: 0.3px;
  border-radius: 3px;
  border: 0;
  cursor: pointer;

  ${(props) =>
    props.raised
      ? `
    border-radius: 2px;
    background-color: ${props.theme.buttons.backgroundColor};
    color: ${props.theme.buttons.color};
  `
      : ''}

  &:hover {
    color: ${(props) => props.theme.buttons.backgroundColorHover};

    ${(props) =>
      props.raised
        ? `
    background-color: ${props.theme.buttons.backgroundColorHover};
    color: ${props.theme.buttons.color};
  `
        : ''}
  }

  &:disabled {
    cursor: default;
    color: ${(props) => props.theme.colors.disabled};

    ${(props) =>
      props.raised
        ? `
      background-color: ${props.theme.buttons.color};
      color: #fff;
  `
        : ''};
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
