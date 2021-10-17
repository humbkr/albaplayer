import React, { FunctionComponent } from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import Icon from 'common/components/Icon'

const SidebarNavLink: FunctionComponent<{
  to: string
  icon?: string
}> = ({ to, icon, children }) => (
  <SidebarNavLinkWrapper to={to}>
    {icon && <Icon>{icon}</Icon>}
    <span>{children}</span>
  </SidebarNavLinkWrapper>
)

export default SidebarNavLink

const SidebarNavLinkWrapper = styled(NavLink)`
  text-align: left;
  padding-left: 15px;
  text-decoration: none;
  cursor: pointer;

  display: block;
  width: 100%;
  height: ${(props) => props.theme.itemHeight};
  color: ${(props) => props.theme.sidebar.textPrimaryColor};

  :hover,
  &.active {
    color: ${(props) => props.theme.sidebar.textPrimaryColorHover};
    background-color: ${(props) => props.theme.sidebar.textPrimaryColor};
  }

  > * {
    display: inline-block;
    vertical-align: middle;
    margin-right: 10px;
  }

  > span {
    height: ${(props) => props.theme.itemHeight};
    line-height: ${(props) => props.theme.itemHeight};
  }
`
