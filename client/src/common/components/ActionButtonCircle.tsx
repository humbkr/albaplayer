import React, { FunctionComponent } from 'react'
import styled from 'styled-components'

const ActionButtonCircle: FunctionComponent<{
  size?: number
  borderWidth?: number
  color?: string
  icon?: string
  backgroundColor?: string
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
  testId?: string
}> = ({
  size = 50,
  borderWidth = 1,
  color = '#fff',
  icon = '',
  backgroundColor = 'transparent',
  onClick,
  testId,
}) => (
  <ActionButtonCircleWrapper
    onClick={onClick}
    color={color}
    data-testid={testId}
  >
    <svg
      width={size + borderWidth}
      height={size + borderWidth}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <circle
          cx="50%"
          cy="50%"
          r={size / 2}
          strokeWidth={borderWidth}
          fill={backgroundColor}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          alignmentBaseline="middle"
          dy=".5em"
        >
          {icon}
        </text>
      </g>
    </svg>
  </ActionButtonCircleWrapper>
)

export default ActionButtonCircle

const ActionButtonCircleWrapper = styled.button`
  display: inline-block;
  cursor: pointer;
  border: none;
  background-color: transparent;

  svg {
    transition: 0.2s ease-out;

    circle {
      transition: 0.2s ease-out;
      stroke: ${(props) => props.color};
    }

    fill: ${(props) => props.color};

    :hover {
      circle {
        stroke: ${(props) => props.theme.buttons.colorHover};
      }

      fill: ${(props) => props.theme.buttons.colorHover};
    }
  }

  // For icon.
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  font-size: 28px;
  display: inline-block;
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
