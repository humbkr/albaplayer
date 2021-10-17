import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Menu as ContextMenu, Item, Submenu, Separator,
} from 'react-contexify'
import 'react-contexify/dist/ReactContexify.min.css'
import {
  addAlbum,
  playAlbum,
  playAlbumAfterCurrent,
} from 'modules/player/redux'
import {
  playlistsSelector,
  addAlbum as addAlbumToPlaylist,
} from 'modules/playlist/redux'
import { RootState } from 'store/types'
import { search, setSearchFilter } from '../redux'

const AlbumContextMenu = () => {
  const playlists = useSelector((state: RootState) => playlistsSelector(state))
  const dispatch = useDispatch()

  const findAllByArtist = (menuItem: any) => {
    dispatch(setSearchFilter('artist'))
    dispatch(search(menuItem.props.data.artist?.name))
  }

  const playlistsItems = playlists.map((item: Playlist) => (
    <Item
      key={item.id}
      onClick={(menuItem: any) => dispatch(
        addAlbumToPlaylist({
          playlistId: item.id,
          albumId: menuItem.props.data.id,
        })
      )}
    >
      {item.title}
    </Item>
  ))
  playlistsItems.push(
    <Item
      key="new"
      onClick={(menuItem: any) => dispatch(addAlbumToPlaylist({ albumId: menuItem.props.data.id }))}
    >
      + Create new playlist
    </Item>
  )

  return (
    <ContextMenu id="album-context-menu">
      <Item
        onClick={(menuItem: any) => dispatch(playAlbum(menuItem.props.data.id))}
      >
        Play now
      </Item>
      <Item
        onClick={(menuItem: any) => dispatch(playAlbumAfterCurrent(menuItem.props.data.id))}
      >
        Play after current track
      </Item>
      <Item
        onClick={(menuItem: any) => dispatch(addAlbum(menuItem.props.data.id))}
      >
        Add to queue
      </Item>
      <Separator />
      <Submenu label="Add to playlist...">{playlistsItems}</Submenu>
      <Separator />
      <Item onClick={(menuItem: any) => findAllByArtist(menuItem)}>
        Find all by the artist
      </Item>
    </ContextMenu>
  )
}

export default AlbumContextMenu
