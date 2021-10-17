import React from 'react'
import styled from 'styled-components'
import SidebarNavLink from './SidebarNavLink'
import Player from '../../modules/player/components/Player'

const Sidebar = () => (
  <Wrapper>
    <Player />
    <MainMenu>
      <SidebarNavLink to="/queue" icon="play_circle_outline">
        Now playing
      </SidebarNavLink>
      <SidebarNavLink to="/library" icon="library_music">
        Library browser
      </SidebarNavLink>
      <SidebarNavLink to="/playlists" icon="view_list">
        Playlists
      </SidebarNavLink>
      <SidebarNavLink to="/inspiration" icon="lightbulb_outline">
        Inspiration
      </SidebarNavLink>
    </MainMenu>
    <SettingsMenu>
      <SidebarNavLink to="/settings" icon="settings">
        Settings
      </SidebarNavLink>
    </SettingsMenu>
  </Wrapper>
)

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
