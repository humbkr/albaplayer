import { useGetUserQuery } from 'modules/user/store/api'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import Icon from 'common/components/Icon'
import { useRef } from 'react'
import useOnClickOutside from 'common/utils/useOnClickOutside'
import { logoutUser, userHasRole } from 'modules/user/utils'
import { useNavigate } from 'react-router'
import ROUTES from 'routing'
import { useToggle } from 'common/utils/useToggle'

function UserActionsMenu() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { data: user } = useGetUserQuery()

  const { toggle, isToggled } = useToggle()

  const ref = useRef(null)
  useOnClickOutside(ref, () => toggle(false))

  const goToAdmin = async () => {
    toggle(false)
    navigate(ROUTES.administration)
  }

  const goToPreferences = async () => {
    toggle(false)
    navigate(ROUTES.preferences)
  }

  const logOutUser = async () => {
    await logoutUser()
  }

  if (!user) {
    return null
  }

  if (user?.isDefaultUser) {
    return (
      <Container data-testid="user-actions-menu-noauth">
        {userHasRole(user, 'admin') && (
          <UserButton active={false} onClick={goToAdmin}>
            <Icon>admin_panel_settings</Icon>
          </UserButton>
        )}
        <UserButton active={false} onClick={goToPreferences}>
          <Icon>settings</Icon>
        </UserButton>
      </Container>
    )
  }

  return (
    <Container ref={ref} data-testid="user-actions-menu-auth">
      <UserButton active={isToggled} onClick={() => toggle()}>
        <Icon>person</Icon>
        {user.name}
        <Icon>{isToggled ? 'expand_less' : 'expand_more'}</Icon>
      </UserButton>
      <Menu isOpen={isToggled}>
        {userHasRole(user, 'admin') && (
          <MenuItem onClick={goToAdmin}>
            {t('settings.administration.title')}{' '}
            <Icon size={18}>admin_panel_settings</Icon>
          </MenuItem>
        )}
        <MenuItem onClick={goToPreferences}>
          {t('settings.preferences.title')} <Icon size={18}>settings</Icon>
        </MenuItem>
        <MenuItem onClick={logOutUser}>
          {t('user.logout')} <Icon size={18}>logout</Icon>
        </MenuItem>
      </Menu>
    </Container>
  )
}

export default UserActionsMenu

const Container = styled.div`
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  margin-right: 10px;
  padding: 8px 0;
`
const UserButton = styled.button<{ active: boolean }>`
  background-color: ${(props) =>
    props.active ? props.theme.colors.background : 'transparent'};
  color: ${(props) => props.theme.colors.sidebarTextPrimary};
  border: 0;
  border-radius: 3px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 5px;
  cursor: pointer;
  height: 100%;
  transition: background-color 0.15s ease-in-out;

  :hover {
    background-color: ${(props) => props.theme.colors.background};
  }
`
const Menu = styled.div<{ isOpen: boolean }>`
  opacity: ${(props) => (props.isOpen ? 1 : 0)};
  visibility: ${(props) => (props.isOpen ? 'visible' : 'hidden')};
  position: absolute;
  top: 44px;
  right: 0;
  min-width: 150px;
  background-color: ${(props) => props.theme.colors.sidebarBackground};
  border: 1px solid ${(props) => props.theme.colors.sidebarSeparator};
  border-radius: 3px;
  z-index: 666;
  padding: 5px 0;
`
const MenuItem = styled.button`
  height: 33px;
  width: 100%;
  text-align: left;
  padding: 0 10px;
  background-color: transparent;
  border: 0;
  color: ${(props) => props.theme.colors.sidebarTextPrimary};
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;

  :hover {
    color: ${(props) => props.theme.colors.sidebarTextPrimaryHover};
    background-color: ${(props) => props.theme.colors.sidebarTextPrimary};
  }
`
