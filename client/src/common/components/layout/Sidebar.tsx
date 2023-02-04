import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import Player from 'modules/player/components/Player'
import SidebarNavLink from 'common/components/layout/SidebarNavLink'

function Sidebar() {
  const { t } = useTranslation()

  return (
    <Container>
      <Player />
      <MainMenu>
        <SidebarNavLink to="/queue" icon="play_circle_outline">
          {t('sidebar.navigation.nowPlaying')}
        </SidebarNavLink>
        <SidebarNavLink to="/library" icon="library_music">
          {t('sidebar.navigation.libraryBrowser')}
        </SidebarNavLink>
        <SidebarNavLink to="/playlists" icon="view_list">
          {t('sidebar.navigation.playlists')}
        </SidebarNavLink>
        <SidebarNavLink to="/inspiration" icon="lightbulb_outline">
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
