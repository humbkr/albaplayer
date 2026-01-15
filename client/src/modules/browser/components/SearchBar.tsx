import type { Ref } from 'react'
import styled from 'styled-components'
import { DebounceInput } from 'react-debounce-input'
import { useTranslation } from 'react-i18next'
import ActionButtonIcon from 'common/components/buttons/ActionButtonIcon'
import { useSearchBar } from 'modules/browser/hooks/useSearchBar'

type Props = {
  ref?: Ref<HTMLElement>
}

export default function SearchBar({ ref }: Props) {
  const { t } = useTranslation()
  const { searchState, changeFilter, runSearch } = useSearchBar()

  return (
    <Container data-testid="search-bar">
      <FilterButton active={searchState.filter === 'all'}>
        <ActionButtonIcon
          onClick={() => changeFilter('all')}
          icon="all_inclusive"
          testId={`search-filter-all${
            searchState.filter === 'all' ? '-active' : ''
          }`}
        />
      </FilterButton>
      <FilterButton active={searchState.filter === 'artist'}>
        <ActionButtonIcon
          onClick={() => changeFilter('artist')}
          icon="person"
          testId={`search-filter-artist${
            searchState.filter === 'artist' ? '-active' : ''
          }`}
        />
      </FilterButton>
      <FilterButton active={searchState.filter === 'album'}>
        <ActionButtonIcon
          onClick={() => changeFilter('album')}
          icon="album"
          testId={`search-filter-album${
            searchState.filter === 'album' ? '-active' : ''
          }`}
        />
      </FilterButton>
      <FilterButton active={searchState.filter === 'track'}>
        <ActionButtonIcon
          onClick={() => changeFilter('track')}
          icon="audiotrack"
          testId={`search-filter-track${
            searchState.filter === 'track' ? '-active' : ''
          }`}
        />
      </FilterButton>
      <SearchInputWrapper>
        <SearchInput
          inputRef={ref}
          debounceTimeout={300}
          onChange={runSearch}
          type="text"
          id="search-input"
          data-testid="search-input"
          value={searchState.term}
          placeholder={t('common.search')}
          autoComplete="off"
          // We need to stop propagation of the keydown event to prevent the space key from
          // triggering the play/pause action in the player.
          onKeyDown={(event) => event.stopPropagation()}
        />
      </SearchInputWrapper>
      <div />
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
`
const FilterButton = styled.div<{
  active: boolean
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${(props) => props.theme.layout.itemHeight};
  background-color: ${(props) =>
    props.active
      ? props.theme.colors.elementHighlightFocus
      : props.theme.colors.sidebarBackground};
  border-right: 1px solid ${(props) => props.theme.colors.sidebarSeparator};
  color: ${(props) =>
    props.active
      ? props.theme.colors.sidebarTextPrimaryHover
      : props.theme.colors.sidebarTextPrimary};
  transition:
    background-color 0.15s ease-in-out,
    color 0.1s ease-in-out;

  ${(props) =>
    props.active &&
    `
    > button:hover {
      color: inherit;
    }
  `}
`
const SearchInputWrapper = styled.div`
  flex-grow: 1;
  vertical-align: middle;
  padding: 8px;
  min-width: 120px;
  max-width: 496px;
  background-color: ${(props) => props.theme.colors.sidebarBackground};
  transition: background-color 0.15s ease-in-out;

  &:focus-within {
    background-color: ${(props) => props.theme.colors.elementHighlightFocus};
  }
`
const SearchInput = styled(DebounceInput)<{
  id: string
  autoComplete: string
}>`
  height: 100%;
  width: 100%;
  font-size: 1em;
  padding-left: 10px;
  background-color: ${(props) => props.theme.colors.inputBackground};
  border: 0;
  border-radius: 3px;
`
