import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import Icon from 'common/components/Icon'
import LibraryBrowserListHeader from 'modules/browser/components/LibraryBrowserListHeader'
import ROUTES from 'routing'
import { generatePath, NavLink, useNavigate } from 'react-router'
import AlbumTeaser from 'modules/browser/components/AlbumTeaser'
import VirtualList from 'common/components/virtualLists/VirtualList'
import { useRef } from 'react'
import { useAlbumsPanel } from 'modules/browser/hooks/useAlbumsPanel'

export default function LibraryBrowserAlbums() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const paneRef = useRef<HTMLDivElement>(null)

  const { albums, currentAlbum, onItemClick } = useAlbumsPanel()

  const onAlbumClick = (itemId: string) => {
    onItemClick(itemId)
    navigate(generatePath(ROUTES.libraryBrowserAlbum, { albumId: itemId }))
  }

  return (
    <Container>
      <Header>
        <BackButton to={ROUTES.libraryBrowser}>
          <Icon size={40}>chevron_left</Icon>
        </BackButton>
        <HeaderContent icon="album" title={t('browser.albums.title')} />
      </Header>
      <VirtualList
        ref={paneRef}
        items={albums}
        itemDisplay={AlbumTeaser}
        currentPosition={
          albums.findIndex((item) => item.id === currentAlbum) || 0
        }
        onItemClick={onAlbumClick}
      />
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100% - ${(props) => props.theme.layout.itemHeight});
`
const Header = styled.div`
  display: flex;
`
const BackButton = styled(NavLink)`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.textPrimary};
  text-decoration: none;
  height: ${(props) => props.theme.layout.itemHeight};
  aspect-ratio: 1;
`
const HeaderContent = styled(LibraryBrowserListHeader)`
  padding: 0;
`
