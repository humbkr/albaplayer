import React, { FunctionComponent } from 'react'
import styled from 'styled-components'

const Button: FunctionComponent<{
  onClick: (e: React.KeyboardEvent) => void
}> = ({ onClick, children }) => (
  <ControlButton
    // @ts-ignore
    onClick={onClick}
  >
    {children}
  </ControlButton>
)

export default Button

const ControlButton = styled.button`
  border: none;
  background-color: transparent;
  padding: 0 10px;

  :hover {
    cursor: pointer;
  }
`
