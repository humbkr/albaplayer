import styled from 'styled-components'

const IconButton = styled.button`
  display: inline-block;
  vertical-align: top;
  width: ${(props) => props.theme.itemHeight};
  height: ${(props) => props.theme.itemHeight};
  border: none;
  background-color: transparent;
  padding: 8px;

  color: ${(props) => props.theme.textPrimaryColor};

  :hover {
    cursor: pointer;
  }
`

export default IconButton
