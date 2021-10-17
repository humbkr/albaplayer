import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Menu as ContextMenu, Item, Submenu, Separator,
} from 'react-contexify'
import 'react-contexify/dist/ReactContexify.min.css'
import {
  addTrack,
  playTrack,
  playTrackAfterCurrent,
} from 'modules/player/redux'
import {
  playlistsSelector,
  addTrack as addTrackToPlaylist,
} from 'modules/playlist/redux'
import { RootState } from 'store/types'
import { search, setSearchFilter } from '../redux'

const TrackContextMenu = () => {
  const playlists = useSelector((state: RootState) => playlistsSelector(state))
  const dispatch = useDispatch()

  const findAllByArtist = (menuItem: any) => {
    dispatch(setSearchFilter('artist'))
    dispatch(search(menuItem.props.data.artist?.name))
  }

  const findAllByAlbum = (menuItem: any) => {
    dispatch(setSearchFilter('album'))
    dispatch(search(menuItem.props.data.album?.title))
  }

  const playlistsItems = playlists.map((item: Playlist) => (
    <Item
      key={item.id}
      onClick={(menuItem: any) => dispatch(
        addTrackToPlaylist({
          playlistId: item.id,
          trackId: menuItem.props.data.id,
        })
      )}
    >
      {item.title}
    </Item>
  ))
  playlistsItems.push(
    <Item
      key="new"
      onClick={(menuItem: any) => dispatch(addTrackToPlaylist({ trackId: menuItem.props.data.id }))}
    >
      + Create new playlist
    </Item>
  )

  return (
    <ContextMenu id="track-context-menu">
      <Item
        onClick={(menuItem: any) => dispatch(playTrack(menuItem.props.data.id))}
      >
        Play now
      </Item>
      <Item
        onClick={(menuItem: any) => dispatch(playTrackAfterCurrent(menuItem.props.data.id))}
      >
        Play after current track
      </Item>
      <Item
        onClick={(menuItem: any) => dispatch(addTrack(menuItem.props.data.id))}
      >
        Add to queue
      </Item>
      <Separator />
      <Submenu label="Add to playlist...">{playlistsItems}</Submenu>
      <Separator />
      <Item onClick={(menuItem: any) => findAllByArtist(menuItem)}>
        Find all by the artist
      </Item>
      <Item onClick={(menuItem: any) => findAllByAlbum(menuItem)}>
        Find all on album
      </Item>
    </ContextMenu>
  )
}

export default TrackContextMenu
