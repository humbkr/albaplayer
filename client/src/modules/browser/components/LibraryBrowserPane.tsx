import styled from 'styled-components'
import LibraryBrowserListItem from 'modules/browser/components/LibraryBrowserListItem'

const LibraryBrowserPane = styled.div`
  display: flex;
  flex-flow: column;
  height: 100%;
  width: 100%;

  :focus-within {
    // Can't find a way to manage that directly in the
    // LibraryBrowserListItem component.
    ${LibraryBrowserListItem}.selected {
      ${(props) => `background-color: ${props.theme.highlightFocus}`};
    }
    ${LibraryBrowserListItem} .selected {
      ${(props) => `color: ${props.theme.textHighlightFocusColor}`};
    }
  }
`

export default LibraryBrowserPane
