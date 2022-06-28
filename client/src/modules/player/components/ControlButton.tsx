import React from 'react'
import styled, { ThemedStyledProps } from 'styled-components'

type StyleProps = {
  active?: boolean
  disabled?: boolean
  size?: number
  noHoverEffect?: boolean
}

type Props = StyleProps & {
  onClick: (e: React.MouseEvent) => void
  testId?: string
  children: React.ReactNode
}

const ControlButton = ({
  onClick,
  active,
  size,
  disabled,
  noHoverEffect,
  testId = 'control-button',
  children,
}: Props) => (
  <Button
    onClick={onClick}
    active={active}
    size={size}
    disabled={disabled}
    noHoverEffect={noHoverEffect}
    data-testid={testId}
  >
    {children}
  </Button>
)

export default ControlButton

function getButtonColor(
  {
    theme,
    disabled,
    active,
    noHoverEffect,
  }: StyleProps & ThemedStyledProps<any, any>,
  hover?: boolean
): string {
  if (disabled) {
    return theme.player.buttons.colorDisabled
  }

  if (hover && !noHoverEffect) {
    return theme.player.buttons.colorHover
  }

  return active ? theme.player.buttons.colorEnabled : theme.player.buttons.color
}

const Button = styled.button<StyleProps>`
  border: none;
  background-color: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: ${(props) => (props.size ? `${props.size}px` : '24px')};
    height: ${(props) => (props.size ? `${props.size}px` : '24px')};

    * {
      transition: fill 0.2s, stroke 0.2s;
    }

    &:not([fill='none']) {
      * {
        fill: ${(props) => getButtonColor(props)};
      }
    }
    &:not([stroke='none']) {
      * {
        stroke: ${(props) => getButtonColor(props)};
      }
    }
  }

  &:hover {
    svg {
      &:not([fill='none']) {
        * {
          fill: ${(props) => getButtonColor(props, true)};
        }
      }
      &:not([stroke='none']) {
        * {
          stroke: ${(props) => getButtonColor(props, true)};
        }
      }
    }
  }

  &:disabled {
    cursor: initial;
  }
`
