import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import Player from 'modules/player/components/Player'
import SidebarNavLink from 'common/components/layout/SidebarNavLink'
import ROUTES from 'routing'

function Sidebar() {
  const { t } = useTranslation()

  return (
    <Container>
      <Player />
      <MainMenu data-testid="main-menu">
        <SidebarNavLink to={ROUTES.nowPlaying} icon="play_circle_outline">
          {t('sidebar.navigation.nowPlaying')}
        </SidebarNavLink>
        <SidebarNavLink to={ROUTES.libraryBrowser} icon="library_music">
          {t('sidebar.navigation.libraryBrowser')}
        </SidebarNavLink>
        <SidebarNavLink to={ROUTES.playlists} icon="view_list">
          {t('sidebar.navigation.collections')}
        </SidebarNavLink>
        <SidebarNavLink to={ROUTES.dashboard} icon="lightbulb_outline">
          {t('sidebar.navigation.inspiration')}
        </SidebarNavLink>
      </MainMenu>
    </Container>
  )
}

export default Sidebar

const Container = styled.div`
  height: 100%;
  background-color: ${(props) => props.theme.colors.sidebarBackground};
`
const MainMenu = styled.div`
  padding-top: 15px;
`
