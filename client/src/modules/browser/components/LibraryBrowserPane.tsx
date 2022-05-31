import styled from 'styled-components'
import VirtualListItem from 'common/components/virtualLists/VirtualListItem'

const LibraryBrowserPane = styled.div`
  display: flex;
  flex-flow: column;
  height: 100%;
  width: 100%;

  :focus-within {
    // Can't find a way to manage that directly in the
    // VirtualListItem component.
    ${VirtualListItem}.selected {
      ${(props) => `background-color: ${props.theme.highlightFocus}`};
    }
    ${VirtualListItem} .selected {
      ${(props) => `color: ${props.theme.textHighlightFocusColor}`};
    }
  }
`

export default LibraryBrowserPane
