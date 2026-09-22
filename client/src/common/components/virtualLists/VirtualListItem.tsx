import styled from 'styled-components'

const VirtualListItem = styled.div<{
  border: boolean
  selected: boolean
  fixedHeight?: boolean
}>`
  width: 100%;
  ${(props) =>
    props.fixedHeight === false
      ? `min-height: ${props.theme.layout.itemHeight};`
      : `height: ${props.theme.layout.itemHeight}; overflow: hidden;`}
  box-sizing: border-box;
  ${(props) =>
    props.border
      ? `border-bottom: 1px solid ${props.theme.colors.separator}`
      : ''};

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
