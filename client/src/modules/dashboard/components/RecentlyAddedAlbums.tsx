import { useEffect, useState } from 'react'
import styled from 'styled-components'
import AlbumTeaserHorizontal from 'modules/dashboard/components/AlbumTeaserHorizontal'
import { Link } from 'react-router'
import { immutableNestedSort } from 'common/utils/utils'
import { useAppSelector } from 'store/hooks'
import { useTranslation } from 'react-i18next'
import type { LibraryStateType } from 'modules/library/store'
import routing from 'routing'
import { useGetUserQuery } from 'modules/user/api'
import { userHasRole } from 'modules/user/utils'
import { USER_ROLE_ADMIN } from 'modules/user/constants'
import { devices } from 'themes/breakpoints'
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

  const { data: user } = useGetUserQuery()
  const canScanLibrary = userHasRole(user, USER_ROLE_ADMIN)

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
              {canScanLibrary && (
                <TextLink to={routing.administration}>
                  {t('dashboard.scanLibrary')}
                </TextLink>
              )}
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
  margin: 0 auto;
  padding-bottom: 10px;
  color: ${(props) => props.theme.colors.textPrimary};

  @media only screen and ${devices.xl} {
    border-radius: 3px;
  }
`
const Header = styled.div`
  padding: 0 20px;
  height: ${(props) => props.theme.layout.itemHeight};
  display: flex;
  align-items: center;
  margin-bottom: 5px;
`
const AlbumsList = styled.div`
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1fr;
  grid-column-gap: 20px;

  @media only screen and ${devices.lg} {
    grid-template-columns: 1fr 1fr;
  }
`
const Cell = styled.div`
  display: inline-flex;
  align-items: center;
  min-width: 220px;
  padding-bottom: 10px;
`
const EmptyState = styled.div`
  padding: 5px 0 10px;
  color: ${(props) => props.theme.colors.textSecondary};
`
const TextLink = styled(Link)`
  color: ${(props) => props.theme.colors.elementHighlightFocus};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`
