import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import Icon from 'common/components/Icon'
import LibraryBrowserListHeader from 'modules/browser/components/LibraryBrowserListHeader'
import ROUTES from 'routing'
import { generatePath, NavLink, useNavigate } from 'react-router'
import { useArtistsPanel } from 'modules/browser/hooks/useArtistsPanel'
import ArtistTeaser from 'modules/browser/components/ArtistTeaser'
import VirtualList from 'common/components/virtualLists/VirtualList'
import { useRef } from 'react'

export default function LibraryBrowserArtists() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const paneRef = useRef<HTMLDivElement>(null)

  const { artists, currentArtist, onItemClick } = useArtistsPanel()

  const onArtistClick = (itemId: string) => {
    onItemClick(itemId)
    if (itemId === '0') {
      navigate(ROUTES.libraryBrowserAlbums)
    } else {
      navigate(generatePath(ROUTES.libraryBrowserArtist, { artistId: itemId }))
    }
  }

  return (
    <Container>
      <Header>
        <BackButton to={ROUTES.libraryBrowser}>
          <Icon size={40}>chevron_left</Icon>
        </BackButton>
        <HeaderContent icon="person" title={t('browser.artists.title')} />
      </Header>
      <VirtualList
        ref={paneRef}
        items={artists}
        itemDisplay={ArtistTeaser}
        currentPosition={
          artists.findIndex((item) => item.id === currentArtist) || 0
        }
        onItemClick={onArtistClick}
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
