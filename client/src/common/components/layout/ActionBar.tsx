import React, { forwardRef, Ref } from 'react'
import styled from 'styled-components'
import SearchBar from 'modules/browser/components/SearchBar'
import UserActionsMenu from 'modules/user/components/UserActionsMenu'

type Props = {
  forwardedRef: Ref<HTMLElement>
}

function ActionBar({ forwardedRef }: Props) {
  return (
    <Container>
      <Search>
        <SearchBar ref={forwardedRef} />
      </Search>
      <UserActionsMenu />
    </Container>
  )
}

export default forwardRef<HTMLElement>((props, ref) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
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
const Search = styled.div`
  flex-grow: 1;
  max-width: 700px;
`
