import type React from 'react'
import { useState } from 'react'
import styled from 'styled-components'
import { contextMenu } from 'react-contexify'
import { useTranslation } from 'react-i18next'
import ActionsMenu from 'common/components/ActionsMenu'
import useLongPress from 'common/hooks/useLongPress'
import { notify } from 'common/utils/notifications'
import { useAppSelector } from 'store/hooks'
import {
  useAddPlaylist,
  usePlayPlaylist,
} from 'modules/collections/services/services'
import usePlaylistContextualActions from 'modules/collections/hooks/usePlaylistContextualActions'

type Props = {
  item: Playlist
  index: number
  onContextMenu: (itemId: string, index: number) => void
}

function PlaylistTeaser({ item, index, onContextMenu }: Props) {
  const { t } = useTranslation()
  const { onClickBehavior } = useAppSelector((state) => state.settings.browser)
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false)
  const actionItems = usePlaylistContextualActions()
  const handlers = useLongPress(() => {
    setIsActionsMenuOpen(true)
  })

  const playPlaylist = usePlayPlaylist()
  const addPlaylist = useAddPlaylist()

  const onDoubleClick = () => {
    switch (onClickBehavior) {
      case 'play':
        playPlaylist(item.id)
        break
      case 'add':
        addPlaylist(item.id)
        notify(
          t('notifications.addedToQueue', { itemName: item.title }),
          'info'
        )
        break
      default:
        break
    }
  }

  const onRightClick = (e: React.MouseEvent) => {
    e.preventDefault()
    onContextMenu(item.id, index)
    contextMenu.show({
      id: 'playlist-context-menu',
      event: e,
      props: {
        data: item,
      },
    })
  }

  return (
    <Wrapper
      onContextMenu={onRightClick}
      onDoubleClick={onDoubleClick}
      {...handlers()}
    >
      <div>{item.title}</div>
      <ActionsMenu
        isOpen={isActionsMenuOpen}
        onClose={() => setIsActionsMenuOpen(false)}
        items={actionItems}
        data={item}
      />
    </Wrapper>
  )
}

export default PlaylistTeaser

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: ${(props) => props.theme.layout.itemHeight};
  padding-left: 15px;
  cursor: pointer;
  color: ${(props) => props.theme.colors.textPrimary};
`
