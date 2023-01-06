import React, { forwardRef, Ref } from 'react'
import styled from 'styled-components'
import SearchBar from 'modules/browser/components/SearchBar'

type Props = {
  forwardedRef: Ref<HTMLElement>
}

function ActionBar({ forwardedRef }: Props) {
  return (
    <Container>
      <Search>
        <SearchBar ref={forwardedRef} />
      </Search>
    </Container>
  )
}

export default forwardRef<HTMLElement>((props, ref) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <ActionBar {...props} forwardedRef={ref} />
))

const Container = styled.div`
  display: flex;
  height: ${(props) => props.theme.itemHeight};
  width: 100%;
  background-color: ${(props) => props.theme.sidebar.background};
  border-bottom: 1px solid ${(props) => props.theme.sidebar.separatorColor};
`
const Search = styled.div`
  width: 60%;
`
