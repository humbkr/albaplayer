import { Item, Menu, Separator, Submenu } from 'react-contexify'
import styled from 'styled-components'
import type { ReactNode } from 'react'

type Props = {
  id: string
  menuItems: ContextualActionsItem<any>[]
  onHidden?: () => void
}

export default function ContextMenu({ id, menuItems, onHidden }: Props) {
  const onVisibilityChange = (visible: boolean) => {
    if (!visible && !!onHidden) {
      onHidden()
    }
  }

  return (
    <ContexifyMenu id={id} onVisibilityChange={onVisibilityChange}>
      {generateMenuItems(menuItems)}
    </ContexifyMenu>
  )
}

function generateMenuItems(items: ContextualActionsItem[]): ReactNode[] {
  return items?.map((menuItem) => {
    if (menuItem.type === 'item') {
      return (
        <Item
          key={menuItem.id}
          onClick={(contexifyMenuItem) => {
            if (menuItem.action) {
              menuItem.action(contexifyMenuItem.props.data)
            }
          }}
        >
          {menuItem.label}
        </Item>
      )
    } else if (menuItem.type === 'separator') {
      return <Separator key={menuItem.id} />
    } else if (menuItem.type === 'subMenu' && menuItem.subActions?.length) {
      return (
        <Submenu label={menuItem.label} key={menuItem.id}>
          {generateMenuItems(menuItem.subActions)}
        </Submenu>
      )
    }
  })
}

const ContexifyMenu = styled(Menu).attrs({
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
