import { useEffect, useState } from 'react'
import styled from 'styled-components'
import AlbumTeaserHorizontal from 'modules/dashboard/components/AlbumTeaserHorizontal'
import { Link } from 'react-router-dom'
import { immutableNestedSort } from 'common/utils/utils'
import { useAppSelector } from 'store/hooks'
import { useTranslation } from 'react-i18next'
import { LibraryStateType } from '../../library/store'
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

function RecentlyAddedAlbums() {
  const { t } = useTranslation()

  const library = useAppSelector((state) => state.library)

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
        <h2>{t('dashboard.recentlyAdded')}</h2>
      </Header>
      <AlbumsList>
        {albums.length === 0 && (
          <EmptyState>
            <p>
              {t('dashboard.noAlbumsFound')}{' '}
              <TextLink to="/settings">{t('dashboard.scanLibrary')}</TextLink>
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
  background-color: ${(props) => props.theme.colors.cardLightBackground};
  max-width: ${(props) => props.theme.layout.contentMaxWidth};
  min-width: 780px;
  margin: 0 auto;
  padding-bottom: 10px;
  color: ${(props) => props.theme.colors.textPrimary};
  border-radius: 3px;
`
const Header = styled.div`
  padding: 0 20px;
  height: ${(props) => props.theme.layout.itemHeight};
  display: flex;
  align-items: center;
`
const AlbumsList = styled.div`
  padding: 0 20px;
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
  color: ${(props) => props.theme.colors.textSecondary};
`
const TextLink = styled(Link)`
  color: ${(props) => props.theme.colors.elementHighlightFocus};
  text-decoration: none;

  :hover {
    text-decoration: underline;
  }
`
