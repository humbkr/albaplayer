import styled from 'styled-components'

const VirtualListItem = styled.div<{
  border: boolean
  selected: boolean
}>`
  width: 100%;
  ${(props) =>
    props.border
      ? `border-bottom: 1px solid ${props.theme.colors.separator}`
      : ''};

  overflow: hidden;
  transition: background-color 0.15s ease-in-out;

  &:hover {
    background-color: ${(props) => props.theme.colors.elementHighlight};
  }

  ${(props) =>
    props.selected
      ? `background-color: ${props.theme.colors.elementHighlight}`
      : ''};
`

export default VirtualListItem
