import React from 'react'
import styled from 'styled-components'

type Props = {
  onClick: (e: React.MouseEvent) => void
  children: React.ReactNode
}

const Button = ({ onClick, children }: Props) => (
  <ControlButton onClick={onClick}>{children}</ControlButton>
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
