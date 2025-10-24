import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import Icon from 'common/components/Icon'
import LibraryBrowserListHeader from 'modules/browser/components/LibraryBrowserListHeader'
import ROUTES from 'routing'
import { generatePath, NavLink } from 'react-router'
import VirtualList from 'common/components/virtualLists/VirtualList'
import { useRef } from 'react'
import { useTracksPanel } from 'modules/browser/hooks/useTracksPanel'
import TrackTeaser from 'modules/browser/components/TrackTeaser'
import { AlbumDetailsHeader } from 'modules/browser/components/AlbumDetailsHeader'
import DiscContextMenu from 'modules/browser/components/DiscContextMenu'
import { useAppSelector } from 'store/hooks'

export default function LibraryBrowserAlbum() {
  const { t } = useTranslation()

  const paneRef = useRef<HTMLDivElement>(null)

  const selectedArtist = useAppSelector(
    (state: RootState) => state.libraryBrowser.selectedArtists
  )

  const {
    items: tracks,
    currentItem: currentTrack,
    onItemClick,
  } = useTracksPanel()

  const getBackLink = () => {
    if (selectedArtist !== '0') {
      return generatePath(ROUTES.libraryBrowserArtist, {
        artistId: selectedArtist,
      })
    }

    return ROUTES.libraryBrowserAlbums
  }

  return (
    <Container>
      <Header>
        <BackButton to={getBackLink()}>
          <Icon size={40}>chevron_left</Icon>
        </BackButton>
        <HeaderContent icon="album" title={t('browser.album.title')} />
      </Header>
      <VirtualList
        ref={paneRef}
        items={tracks}
        itemDisplay={TrackTeaser}
        currentPosition={
          tracks.findIndex((item) => item.id === currentTrack) || 0
        }
        onItemClick={onItemClick}
        Header={<AlbumDetailsHeader />}
        fixedItemHeight={false}
      />
      <DiscContextMenu />
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
