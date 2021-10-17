import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Menu as ContextMenu, Item, Submenu } from 'react-contexify'
import 'react-contexify/dist/ReactContexify.min.css'
import { playlistsSelector, addCurrentQueue } from 'modules/playlist/redux'
import { RootState } from 'store/types'

const QueueActionsMoreContextMenu: React.FC = () => {
  const playlists = useSelector((state: RootState) => playlistsSelector(state))
  const dispatch = useDispatch()

  const playlistsItems = playlists.map((item) => (
    <Item
      key={item.id}
      onClick={(menuItem: any) => dispatch(addCurrentQueue({ playlistId: menuItem.props.data.id }))}
    >
      {item.title}
    </Item>
  ))
  playlistsItems.push(
    <Item key="new" onClick={() => dispatch(addCurrentQueue({}))}>
      + Create new playlist
    </Item>
  )

  return (
    <ContextMenu id="queue-actions-more-menu">
      <Submenu label="Add to playlist...">{playlistsItems}</Submenu>
    </ContextMenu>
  )
}

export default QueueActionsMoreContextMenu
