import React from 'react'
import styled from 'styled-components'

const SearchLink: React.FC<{
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
}> = ({ onClick, children }) => (
  <StyledButton type="button" onClick={onClick}>
    {children}
  </StyledButton>
)

export default SearchLink

const StyledButton = styled.button`
  background-color: transparent;
  border: 0;
  color: ${(props) => props.theme.nowPlaying.textPrimaryColor};
  font-size: inherit;
  font-style: inherit;

  :hover {
    cursor: pointer;
    text-decoration: underline;
  }
`
