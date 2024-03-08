import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import Icon from 'common/components/Icon'

type Props = {
  to: string
  icon?: string
  children?: React.ReactNode
}

function SidebarNavLink({ to, icon, children }: Props) {
  return (
    <SidebarNavLinkWrapper to={to}>
      {icon && <Icon>{icon}</Icon>}
      <span>{children}</span>
    </SidebarNavLinkWrapper>
  )
}

export default SidebarNavLink

const SidebarNavLinkWrapper = styled(NavLink)`
  padding-left: 15px;
  text-decoration: none;
  cursor: pointer;

  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: ${(props) => props.theme.layout.itemHeight};
  color: ${(props) => props.theme.colors.sidebarTextPrimary};
  transition: 0.15s ease-in-out;

  :hover,
  &.active {
    color: ${(props) => props.theme.colors.sidebarTextPrimaryHover};
    background-color: ${(props) => props.theme.colors.sidebarTextPrimary};
  }

  > * {
    display: inline-block;
    vertical-align: middle;
    margin-right: 10px;
  }

  > span {
    height: ${(props) => props.theme.layout.itemHeight};
    line-height: ${(props) => props.theme.layout.itemHeight};
  }
`
