import React from 'react'
import { Menu as ContextMenu, Item, Submenu } from 'react-contexify'
import 'react-contexify/dist/ReactContexify.min.css'
import { playlistsSelector, addCurrentQueue } from 'modules/playlist/store'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { useTranslation } from 'react-i18next'

const QueueActionsMoreContextMenu: React.FC = () => {
  const { t } = useTranslation()

  const playlists = useAppSelector((state) => playlistsSelector(state))
  const dispatch = useAppDispatch()

  const playlistsItems = playlists.map((item) => (
    <Item
      key={item.id}
      onClick={(menuItem: any) =>
        dispatch(addCurrentQueue({ playlistId: menuItem.props.data.id }))
      }
    >
      {item.title}
    </Item>
  ))
  playlistsItems.push(
    <Item key="new" onClick={() => dispatch(addCurrentQueue({}))}>
      {t('playlists.actions.createNewPlaylist')}
    </Item>
  )

  return (
    <ContextMenu id="queue-actions-more-menu">
      <Submenu label={t('playlists.actions.addToPlaylist')}>
        {playlistsItems}
      </Submenu>
    </ContextMenu>
  )
}

export default QueueActionsMoreContextMenu
