import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import AlbumTeaserHorizontal from 'modules/dashboard/components/AlbumTeaserHorizontal'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { immutableNestedSort } from 'common/utils/utils'
import { RootState } from '../../../store/types'
import { LibraryStateType } from '../../library/redux'
import AlbumMoreActionsContextMenu from './AlbumMoreActionsContextMenu'

export const getRecentlyAddedAlbums = (
  library: LibraryStateType,
  number: number
) => {
  const recent = immutableNestedSort(
    Object.values(library.albums),
    'dateAdded',
    'DESC'
  ).slice(0, number)

  return recent.map((item) => ({
    ...item,
    artist: library.artists[item.artistId],
  }))
}

const RecentlyAddedAlbums: React.FC = () => {
  const library = useSelector((state: RootState) => state.library)

  const [albums, setAlbums] = useState<Album[]>([])
  const [selectedAlbum, setSelectedAlbum] = useState<string | undefined>(
    undefined
  )

  useEffect(() => {
    setAlbums(getRecentlyAddedAlbums(library, 6))
  }, [library])

  return (
    <Wrapper>
      <Header>
        <h2>Recently added</h2>
      </Header>
      <AlbumsList>
        {albums.length === 0 && (
          <EmptyState>
            <p>
              No album found in the library.{' '}
              <TextLink to="/settings">Scan library</TextLink>
            </p>
          </EmptyState>
        )}
        {albums.map((album) => (
          <Cell key={album.id}>
            <AlbumTeaserHorizontal
              album={album}
              selected={selectedAlbum === album.id}
              setSelected={setSelectedAlbum}
            />
          </Cell>
        ))}
      </AlbumsList>
      <AlbumMoreActionsContextMenu
        menuId="recent-album-more-actions-context-menu"
        onHidden={() => setSelectedAlbum(undefined)}
      />
    </Wrapper>
  )
}

export default RecentlyAddedAlbums

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.cards.backgroundColor};
  max-width: 1060px;
  min-width: 780px;
  margin: 0 auto;
  padding-bottom: 10px;
  color: ${(props) => props.theme.textPrimaryColor};
`
const Header = styled.div`
  padding: 0px 20px;
  height: ${(props) => props.theme.itemHeight};
  display: flex;
  align-items: center;
`
const AlbumsList = styled.div`
  padding: 0px 20px;
`
const Cell = styled.div`
  display: inline-flex;
  align-items: center;
  min-width: 220px;
  width: 50%;
  padding-bottom: 10px;
`
const EmptyState = styled.div`
  padding: 5px 0 10px;
  color: ${(props) => props.theme.textSecondaryColor};
`
const TextLink = styled(Link)`
  color: ${(props) => props.theme.highlightFocus};
  text-decoration: none;

  :hover {
    text-decoration: underline;
  }
`
