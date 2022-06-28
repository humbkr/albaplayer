import React from 'react'
import { Menu as ContextMenu, Item, Submenu, Separator } from 'react-contexify'
import 'react-contexify/dist/ReactContexify.min.css'
import {
  addPlaylist,
  playPlaylist,
  playPlaylistAfterCurrent,
} from 'modules/player/store'
import { addPlaylist as addPlaylistToPlaylist } from 'modules/playlist/store'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { EditPlaylistContext } from '../scenes/Playlists'

const PlaylistContextMenu = () => {
  const playlists = useAppSelector((state) =>
    Object.values(state.playlist.playlists)
  )
  const dispatch = useAppDispatch()

  // @ts-ignore
  const playlistsItems = playlists.map((item: Playlist) => (
    <Item
      key={item.id}
      onClick={(menuItem: any) =>
        dispatch(
          addPlaylistToPlaylist({
            playlistId: item.id,
            playlistToAddId: menuItem.props.data.id,
          })
        )
      }
    >
      {item.title}
    </Item>
  ))
  playlistsItems.push(
    <Item
      key="new"
      onClick={(menuItem: any) =>
        dispatch(
          addPlaylistToPlaylist({ playlistToAddId: menuItem.props.data.id })
        )
      }
    >
      + Duplicate playlist
    </Item>
  )

  return (
    <EditPlaylistContext.Consumer>
      {(value: any) => (
        <ContextMenu id="playlist-context-menu">
          <Item
            onClick={(menuItem: any) =>
              dispatch(playPlaylist(menuItem.props.data.id))
            }
          >
            Play now
          </Item>
          <Item
            onClick={(menuItem: any) =>
              dispatch(playPlaylistAfterCurrent(menuItem.props.data.id))
            }
          >
            Play after current track
          </Item>
          <Item
            onClick={(menuItem: any) =>
              dispatch(addPlaylist(menuItem.props.data.id))
            }
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
