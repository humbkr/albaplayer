import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import Player from 'modules/player/components/Player'
import SidebarNavLink from './SidebarNavLink'

const Sidebar = () => {
  const { t } = useTranslation()

  return (
    <Wrapper>
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
      <SettingsMenu>
        <SidebarNavLink to="/settings" icon="settings">
          {t('sidebar.navigation.settings')}
        </SidebarNavLink>
      </SettingsMenu>
    </Wrapper>
  )
}

export default Sidebar

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: ${(props) => props.theme.sidebar.width};
  height: 100%;
  background-color: ${(props) => props.theme.sidebar.background};
`
const MainMenu = styled.div`
  padding-top: 15px;
`

const SettingsMenu = styled.div`
  position: absolute;
  width: 100%;
  bottom: 0;
  display: flex;
  justify-content: flex-end;
`
