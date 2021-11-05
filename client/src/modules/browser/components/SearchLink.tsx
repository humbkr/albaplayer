import React from 'react'
import styled from 'styled-components'
import useSearch from '../hooks/useSearch'

type Props = {
  type: 'artist' | 'album'
  searchString?: string
}

const SearchLink: React.FC<Props> = ({ type, searchString }) => {
  const { searchForAlbum, searchForArtist } = useSearch()

  const onClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.stopPropagation()

    if (searchString) {
      if (type === 'artist') {
        searchForArtist(searchString)
      } else if (type === 'album') {
        searchForAlbum(searchString)
      }
    }
  }

  return (
    // We need a link so the browser can manage text wrapping correctly.
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <Link onClick={onClick}>{searchString}</Link>
  )
}

export default SearchLink

const Link = styled.a`
  background-color: transparent;
  border: 0;
  color: inherit;
  font-size: inherit;
  font-style: inherit;
  white-space: normal;
  word-wrap: break-word;
  display: inline;
  cursor: pointer;

  :hover {
    text-decoration: underline;
  }
`
