import styled from 'styled-components'

const VirtualListItem = styled.div<{
  border: boolean
  selected: boolean
}>`
  width: 100%;
  ${(props) =>
    props.border
      ? `border-bottom: 1px solid ${props.theme.separatorColor}`
      : ''};

  height: ${(props) => props.theme.itemHeight};
  overflow: hidden;

  :hover {
    background-color: ${(props) => props.theme.highlight};
  }

  ${(props) =>
    props.selected ? `background-color: ${props.theme.highlight}` : ''};

  > * {
    display: block;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
  }
`

export default VirtualListItem
