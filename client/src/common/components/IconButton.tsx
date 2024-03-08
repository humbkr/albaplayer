import styled from 'styled-components'

const IconButton = styled.button`
  display: inline-block;
  vertical-align: top;
  width: ${(props) => props.theme.layout.itemHeight};
  height: ${(props) => props.theme.layout.itemHeight};
  border: none;
  background-color: transparent;
  padding: 8px;

  color: ${(props) => props.theme.colors.textPrimary};

  :hover {
    cursor: pointer;
  }
`

export default IconButton
