import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import Icon from 'common/components/Icon'

function MainMenu() {
  return (
    <Container data-testid="main-menu">
      <NavLinkWrapper to="/queue">
        <Icon>play_circle_outline</Icon>
      </NavLinkWrapper>
      <NavLinkWrapper to="/library">
        <Icon>library_music</Icon>
      </NavLinkWrapper>
      <NavLinkWrapper to="/playlists">
        <Icon>view_list</Icon>
      </NavLinkWrapper>
      <NavLinkWrapper to="/inspiration">
        <Icon>lightbulb_outline</Icon>
      </NavLinkWrapper>
    </Container>
  )
}

export default MainMenu

const Container = styled.div`
  display: grid;
  grid-template-columns: 25% 25% 25% 25%;
  width: 100vw;
  height: 60px;
`
const NavLinkWrapper = styled(NavLink)`
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  color: ${(props) => props.theme.colors.sidebarTextPrimary};
  transition: 0.15s ease-in-out;

  :hover,
  &.active {
    color: ${(props) => props.theme.colors.elementHighlightFocus};
  }
`
