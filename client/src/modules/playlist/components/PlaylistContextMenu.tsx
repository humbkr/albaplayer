import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Menu as ContextMenu, Item, Submenu, Separator,
} from 'react-contexify'
import 'react-contexify/dist/ReactContexify.min.css'
import {
  addPlaylist,
  playPlaylist,
  playPlaylistAfterCurrent,
} from 'modules/player/redux'
import { addPlaylist as addPlaylistToPlaylist } from 'modules/playlist/redux'
// eslint-disable-next-line import/no-cycle
import { RootState } from 'store/types'
import { EditPlaylistContext } from '../scenes/Playlists'

const PlaylistContextMenu = () => {
  const playlists = useSelector((state: RootState) => Object.values(state.playlist.playlists))
  const dispatch = useDispatch()

  // @ts-ignore
  const playlistsItems = playlists.map((item: Playlist) => (
    <Item
      key={item.id}
      onClick={(menuItem: any) => dispatch(
        addPlaylistToPlaylist({
          playlistId: item.id,
          playlistToAddId: menuItem.props.data.id,
        })
      )}
    >
      {item.title}
    </Item>
  ))
  playlistsItems.push(
    <Item
      key="new"
      onClick={(menuItem: any) => dispatch(
        addPlaylistToPlaylist({ playlistToAddId: menuItem.props.data.id })
      )}
    >
      + Duplicate playlist
    </Item>
  )

  return (
    <EditPlaylistContext.Consumer>
      {(value: any) => (
        <ContextMenu id="playlist-context-menu">
          <Item
            onClick={(menuItem: any) => dispatch(playPlaylist(menuItem.props.data.id))}
          >
            Play now
          </Item>
          <Item
            onClick={(menuItem: any) => dispatch(playPlaylistAfterCurrent(menuItem.props.data.id))}
          >
            Play after current track
          </Item>
          <Item
            onClick={(menuItem: any) => dispatch(addPlaylist(menuItem.props.data.id))}
          >
            Add to queue
          </Item>
          <Separator />
          <Submenu label="Add to playlist...">{playlistsItems}</Submenu>
          <Separator />
          <Item onClick={() => value('edit')}>Edit playlist</Item>
        </ContextMenu>
      )}
    </EditPlaylistContext.Consumer>
  )
}

export default PlaylistContextMenu
