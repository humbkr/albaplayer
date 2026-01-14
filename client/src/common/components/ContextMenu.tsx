import { Menu } from 'react-contexify'
import styled from 'styled-components'

const ContextMenu = styled(Menu).attrs({
  // Custom props
})`
  --contexify-menu-bgColor: ${(props) =>
    props.theme.colors.contextMenuBackground};
  --contexify-menu-radius: 3px;
  --contexify-separator-color: ${(props) =>
    props.theme.colors.contextMenuSeparator};
  --contexify-item-color: ${(props) => props.theme.colors.textPrimary};
  --contexify-itemContent-padding: 12px;
  --contexify-activeItem-color: ${(props) =>
    props.theme.colors.contextMenuItemHoverText};
  --contexify-activeItem-bgColor: ${(props) =>
    props.theme.colors.contextMenuItemHoverBackground};
  --contexify-activeItem-radius: 3px;
  --contexify-rightSlot-color: #6f6e77;
  --contexify-activeRightSlot-color: ${(props) =>
    props.theme.colors.textPrimary};
  --contexify-arrow-color: ${(props) => props.theme.colors.textPrimary};
  --contexify-activeArrow-color: ${(props) =>
    props.theme.colors.sidebarTextPrimaryHover};
`

export default ContextMenu
