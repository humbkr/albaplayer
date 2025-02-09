import type React from 'react'
import styled from 'styled-components'
import type { Option } from 'common/components/forms/SelectContainer'
import SelectContainer from 'common/components/forms/SelectContainer'
import Icon from 'common/components/Icon'

type Props = {
  orderByOptions?: Option[]
  orderBy?: string
  title?: string
  icon?: string
  onChange?: (event: React.MouseEvent<HTMLSelectElement>) => void
}

function LibraryBrowserListHeader({
  orderByOptions,
  orderBy = '',
  title = '',
  icon,
  onChange = () => {},
}: Props) {
  return (
    <LibraryBrowserListHeaderWrapper>
      <ContentWrapper>
        <Title>
          {icon && <Icon size={22}>{icon}</Icon>}
          <h2>{title}</h2>
        </Title>
        {orderByOptions && (
          <SelectContainer
            tabIndex="-1"
            options={orderByOptions}
            value={orderBy}
            onChangeHandler={onChange}
          />
        )}
      </ContentWrapper>
    </LibraryBrowserListHeaderWrapper>
  )
}

export default LibraryBrowserListHeader

const LibraryBrowserListHeaderWrapper = styled.div`
  flex: 0 1 ${(props) => props.theme.layout.itemHeight};
  color: ${(props) => props.theme.colors.textSecondary};
  padding: 0 15px;
`
const ContentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;

  > div {
    display: flex;
  }
`
const Title = styled.div`
  display: flex;
  gap: 10px;

  > i {
    display: block;
  }

  > h2 {
    font-size: 1.2em;
  }
`
