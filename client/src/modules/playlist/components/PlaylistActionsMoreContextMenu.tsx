import React from 'react'
import { Menu as ContextMenu, Item, Submenu, Separator } from 'react-contexify'
import { MenuItemEventHandler } from 'react-contexify/lib/types'
import 'react-contexify/dist/ReactContexify.min.css'
import {
  playlistsSelector,
  playlistDeletePlaylist,
  addPlaylist as addPlaylistToPlaylist,
  playlistChangePane,
  PlaylistPane,
} from 'modules/playlist/store'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { playPlaylistAfterCurrent } from 'modules/player/store/store'
import { EditPlaylistContext } from '../scenes/Playlists'

interface MenuItemEventHandlerPlaylist extends MenuItemEventHandler {
  props: {
    playlist: Playlist
  }
}

const PlaylistActionsMoreContextMenu: React.FC = () => {
  const playlists = useAppSelector((state) => playlistsSelector(state))

  const dispatch = useAppDispatch()

  const playlistsItems = playlists.map((item) => (
    <Item
      key={item.id}
      onClick={(menuItem: any) =>
        dispatch(
          addPlaylistToPlaylist({
            playlistId: item.id,
            playlistToAddId: menuItem.props.playlist.id,
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
          addPlaylistToPlaylist({ playlistToAddId: menuItem.props.playlist.id })
        )
      }
    >
      + Duplicate playlist
    </Item>
  )

  return (
    <EditPlaylistContext.Consumer>
      {(value: any) => (
        <ContextMenu id="playlist-actions-more-menu">
          <Item
            onClick={(menuItem: any) =>
              dispatch(playPlaylistAfterCurrent(menuItem.props.playlist.id))
            }
          >
            Play after current track
          </Item>
          <Separator />
          <Submenu label="Add to playlist...">{playlistsItems}</Submenu>
          <Separator />
          <Item onClick={() => value('edit')}>Edit playlist</Item>
          <Item
            // @ts-ignore
            onClick={(menuItem: MenuItemEventHandlerPlaylist) => {
              if (
                // eslint-disable-next-line no-alert
                window.confirm('Are you sure you wish to delete this playlist?')
              ) {
                dispatch(playlistDeletePlaylist(menuItem.props.playlist))
              }
            }}
          >
            Delete playlist
          </Item>
          <Separator />
          <Item onClick={() => dispatch(playlistChangePane(PlaylistPane.Fix))}>
            Fix dead tracks...
          </Item>
        </ContextMenu>
      )}
    </EditPlaylistContext.Consumer>
  )
}

export default PlaylistActionsMoreContextMenu
