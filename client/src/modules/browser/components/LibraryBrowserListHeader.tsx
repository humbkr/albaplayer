import React, { FunctionComponent } from 'react'
import styled from 'styled-components'
import SelectContainer, { Option } from 'common/components/SelectContainer'

const LibraryBrowserListHeader: FunctionComponent<{
  orderByOptions: Option[]
  orderBy: string
  title?: string
  onChange: (event: React.MouseEvent<HTMLSelectElement>) => void
}> = ({
  orderByOptions, orderBy, title = '', onChange,
}) => (
  <LibraryBrowserListHeaderWrapper>
    <ContentWrapper>
      <h2>{title}</h2>
      <SelectContainer
        tabIndex="-1"
        options={orderByOptions}
        value={orderBy}
        onChangeHandler={onChange}
      />
    </ContentWrapper>
  </LibraryBrowserListHeaderWrapper>
)

export default LibraryBrowserListHeader

const LibraryBrowserListHeaderWrapper = styled.div`
  flex: 0 1 ${(props) => props.theme.itemHeight};
  color: ${(props) => props.theme.textSecondaryColor};
  padding: 0 15px;
`
const ContentWrapper = styled.div`
  display: table;
  width: 100%;
  height: 100%;

  > h2 {
    display: table-cell;
    vertical-align: middle;
    font-size: 1.2em;
  }

  > div {
    display: table-cell;
    vertical-align: middle;
  }
`
