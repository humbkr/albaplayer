import React, { forwardRef, Ref } from 'react'
import styled from 'styled-components'
import { DebounceInput } from 'react-debounce-input'
import { search, setSearchFilter } from 'modules/browser/store'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { useTranslation } from 'react-i18next'
import ActionButtonIcon from '../../../common/components/ActionButtonIcon'

type Props = {
  forwardedRef: Ref<HTMLElement>
}

function LibraryBrowserSearchBar({ forwardedRef }: Props) {
  const { t } = useTranslation()

  const searchState = useAppSelector((state) => state.libraryBrowser.search)

  const dispatch = useAppDispatch()

  const changeFilter = (filter: SearchFilter) => {
    dispatch(setSearchFilter(filter))
  }

  const runSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(search((event.target as HTMLInputElement).value))
  }

  return (
    <LibraryBrowserSearchBarWrapper>
      <FilterButtonWrapper active={searchState.filter === 'all'}>
        <ActionButtonIconStyled
          onClick={() => changeFilter('all')}
          icon="all_inclusive"
          testId={`search-filter-all${
            searchState.filter === 'all' ? '-active' : ''
          }`}
        />
      </FilterButtonWrapper>
      <FilterButtonWrapper active={searchState.filter === 'artist'}>
        <ActionButtonIconStyled
          onClick={() => changeFilter('artist')}
          icon="person"
          testId={`search-filter-artist${
            searchState.filter === 'artist' ? '-active' : ''
          }`}
        />
      </FilterButtonWrapper>
      <FilterButtonWrapper active={searchState.filter === 'album'}>
        <ActionButtonIconStyled
          onClick={() => changeFilter('album')}
          icon="album"
          testId={`search-filter-album${
            searchState.filter === 'album' ? '-active' : ''
          }`}
        />
      </FilterButtonWrapper>
      <FilterButtonWrapper active={searchState.filter === 'track'}>
        <ActionButtonIconStyled
          onClick={() => changeFilter('track')}
          icon="audiotrack"
          testId={`search-filter-track${
            searchState.filter === 'track' ? '-active' : ''
          }`}
        />
      </FilterButtonWrapper>
      <SearchBarInputWrapper>
        <SearchBarInput
          // @ts-ignore
          inputRef={forwardedRef}
          debounceTimeout={300}
          onChange={runSearch}
          type="text"
          id="search-input"
          data-testid="search-input"
          value={searchState.term}
          placeholder={t('common.search')}
          autoComplete="off"
        />
      </SearchBarInputWrapper>
    </LibraryBrowserSearchBarWrapper>
  )
}

export default forwardRef<HTMLElement>((props, ref) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <LibraryBrowserSearchBar {...props} forwardedRef={ref} />
))

const LibraryBrowserSearchBarWrapper = styled.div`
  display: flex;
  height: ${(props) => props.theme.itemHeight};
  width: 100%;
  border-bottom: 1px solid ${(props) => props.theme.separatorColor};
`
const FilterButtonWrapper = styled.div<{
  active: boolean
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${(props) => props.theme.itemHeight};
  background-color: ${(props) =>
    props.active ? props.theme.highlightFocus : props.theme.sidebar.background};
  border-right: 1px solid ${(props) => props.theme.sidebar.separatorColor};
`
const ActionButtonIconStyled = styled(ActionButtonIcon)`
  width: 100%;
  height: 100%;
  color: ${(props) => props.theme.sidebar.textPrimaryColor};

  &:focus {
    border: 1px solid ${(props) => props.theme.highlightFocus};
  }
`
const SearchBarInputWrapper = styled.div`
  flex-grow: 1;
  vertical-align: middle;
  padding: 8px;
  background-color: ${(props) => props.theme.sidebar.background};

  :focus-within {
    background-color: ${(props) => props.theme.highlightFocus};
  }
`
const SearchBarInput = styled(DebounceInput)<{
  id: string
  autoComplete: string
}>`
  height: 100%;
  width: 100%;
  font-size: 1em;
  padding-left: 10px;
  background-color: ${(props) => props.theme.inputs.backgroundColor};
  border: 1px solid rgb(211, 211, 211);
`
