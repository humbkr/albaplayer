import { forwardRef } from 'react'
import type { Ref } from 'react'
import styled from 'styled-components'
import { useSearchBar } from 'modules/browser/hooks/useSearchBar'
import { useTranslation } from 'react-i18next'
import { DebounceInput } from 'react-debounce-input'

type Props = {
  forwardedRef: Ref<HTMLElement>
}

function ActionBar({ forwardedRef }: Props) {
  const { t } = useTranslation()
  const { searchState, runSearch } = useSearchBar()

  return (
    <Container>
      <SearchInputWrapper>
        <SearchInput
          inputRef={forwardedRef}
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
    </Container>
  )
}

export default forwardRef<HTMLElement>((props, ref) => (
  <ActionBar {...props} forwardedRef={ref} />
))

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  height: ${(props) => props.theme.layout.itemHeight};
  width: 100%;
  gap: 10px;
  background-color: ${(props) => props.theme.colors.sidebarBackground};

  border-bottom: ${(props) =>
    props.theme.isDark
      ? `1px solid ${props.theme.colors.sidebarSeparator}`
      : 0};
`
const SearchInputWrapper = styled.div`
  flex-grow: 1;
  vertical-align: middle;
  padding: 8px;
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
  min-width: 100px;
  max-width: 480px;
  font-size: 1em;
  padding-left: 10px;
  background-color: ${(props) => props.theme.colors.inputBackground};
  border: 0;
  border-radius: 3px;
`
