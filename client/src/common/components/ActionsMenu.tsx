import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'
import Icon from 'common/components/Icon'

type Props = {
  isOpen: boolean
  onClose: () => void
  items: ContextualActionsItem<any>[]
  data: any
}

export default function ActionsMenu({ isOpen, onClose, items, data }: Props) {
  const [activeSubMenu, setActiveSubMenu] =
    useState<ContextualActionsItem<any> | null>(null)

  useEffect(() => {
    if (!isOpen) {
      setActiveSubMenu(null)
    }
  }, [isOpen])

  if (!isOpen) {
    return null
  }

  const handleItemClick = (item: ContextualActionsItem<any>) => {
    if (item.type === 'subMenu') {
      setActiveSubMenu(item)
    } else if (item.type === 'item' && item.action) {
      item.action(data)
      onClose()
    }
  }

  const currentItems = activeSubMenu ? (activeSubMenu.subActions ?? []) : items

  return createPortal(
    <Overlay onClick={onClose}>
      <Panel onClick={(e) => e.stopPropagation()}>
        {activeSubMenu && (
          <SubMenuHeader>
            <BackButton onClick={() => setActiveSubMenu(null)}>
              <Icon>arrow_back_ios</Icon>
            </BackButton>
            <SubMenuTitle>{activeSubMenu.label}</SubMenuTitle>
          </SubMenuHeader>
        )}
        <ItemList>
          {currentItems.map((item, index) => {
            if (item.type === 'separator') {
              return <Separator key={item.id ?? `sep-${index}`} />
            }
            return (
              <MenuItem
                key={item.id ?? index}
                onClick={() => handleItemClick(item)}
              >
                <ItemLabel>{item.label}</ItemLabel>
                {item.type === 'subMenu' && (
                  <Icon size={18}>chevron_right</Icon>
                )}
              </MenuItem>
            )
          })}
        </ItemList>
      </Panel>
    </Overlay>,
    document.body
  )
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`
const Panel = styled.div`
  background-color: ${({ theme }) => theme.colors.contextMenuBackground};
  border-radius: 8px;
  -webkit-user-select: none;
  user-select: none;
  -webkit-touch-callout: none;
  min-width: 220px;
  max-width: min(80vw, 340px);
  max-height: 70vh;
  overflow-y: auto;
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.4),
    0 4px 8px rgba(0, 0, 0, 0.2);
`
const SubMenuHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 8px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.contextMenuSeparator};
`
const BackButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textPrimary};
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
`
const SubMenuTitle = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.85em;
  padding-left: 4px;
`
const ItemList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 4px 0;
`
const MenuItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textPrimary};

  &:active {
    background-color: ${({ theme }) =>
      theme.colors.contextMenuItemHoverBackground};
    color: ${({ theme }) => theme.colors.contextMenuItemHoverText};
  }

  @media (hover: hover) {
    &:hover {
      background-color: ${({ theme }) =>
        theme.colors.contextMenuItemHoverBackground};
      color: ${({ theme }) => theme.colors.contextMenuItemHoverText};
    }
  }
`
const ItemLabel = styled.span`
  flex: 1;
`
const Separator = styled.li`
  height: 1px;
  margin: 4px 0;
  background-color: ${({ theme }) => theme.colors.contextMenuSeparator};
`
