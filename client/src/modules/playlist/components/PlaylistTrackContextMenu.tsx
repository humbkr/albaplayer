import React from 'react'
import { Menu as ContextMenu, Item, Submenu, Separator } from 'react-contexify'
import 'react-contexify/dist/ReactContexify.min.css'
import {
  addTrack,
  playTrack,
  playTrackAfterCurrent,
} from 'modules/player/store'
import {
  playlistsSelector,
  playlistRemoveTrack,
  addTrack as addTrackToPlaylist,
} from 'modules/playlist/store'
import { useNavigate } from 'react-router'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { search, setSearchFilter } from '../../browser/store'

const PlaylistTrackContextMenu = () => {
  const playlists = useAppSelector((state) => playlistsSelector(state))
  const currentPlaylist = useAppSelector(
    (state) => state.playlist.currentPlaylist.playlist
  )

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const findAllByArtist = (menuItem: any) => {
    dispatch(setSearchFilter('artist'))
    dispatch(search(menuItem.props.data.track.artist?.name))
    navigate('/library')
  }

  const findAllByAlbum = (menuItem: any) => {
    dispatch(setSearchFilter('album'))
    dispatch(search(menuItem.props.data.track.album?.title))
    navigate('/library')
  }

  const playlistsItems = playlists.map((item: Playlist) => (
    <Item
      key={item.id}
      onClick={(menuItem: any) =>
        dispatch(
          addTrackToPlaylist({
            playlistId: item.id,
            trackId: menuItem.props.data.track.id,
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
        dispatch(addTrackToPlaylist({ trackId: menuItem.props.data.id }))
      }
    >
      + Create new playlist
    </Item>
  )

  return (
    <ContextMenu id="playlist-track-context-menu">
      <Item
        onClick={(menuItem: any) =>
          dispatch(playTrack(menuItem.props.data.track.id))
        }
      >
        Play now
      </Item>
      <Item
        onClick={(menuItem: any) =>
          dispatch(playTrackAfterCurrent(menuItem.props.data.track.id))
        }
      >
        Play after current track
      </Item>
      <Item
        onClick={(menuItem: any) =>
          dispatch(addTrack(menuItem.props.data.track.id))
        }
      >
        Add to queue
      </Item>
      <Separator />
      <Submenu label="Add to playlist...">{playlistsItems}</Submenu>
      <Separator />
      <Item
        onClick={(menuItem: any) =>
          dispatch(
            playlistRemoveTrack({
              playlistId: currentPlaylist.id,
              trackPosition: menuItem.props.data.position,
            })
          )
        }
      >
        Remove from playlist
      </Item>
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

export default PlaylistTrackContextMenu
