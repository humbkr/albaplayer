import React from 'react'
import { Menu as ContextMenu, Item, Submenu, Separator } from 'react-contexify'
import 'react-contexify/dist/ReactContexify.min.css'
import {
  addArtist,
  playArtist,
  playArtistAfterCurrent,
} from 'modules/player/store'
import {
  playlistsSelector,
  addArtist as addArtistToPlaylist,
} from 'modules/playlist/store'
import { useAppDispatch, useAppSelector } from 'store/hooks'

const ArtistContextMenu = () => {
  const playlists = useAppSelector((state) => playlistsSelector(state))
  const dispatch = useAppDispatch()

  const playlistsItems = playlists.map((item: Playlist) => (
    <Item
      key={item.id}
      onClick={(menuItem: any) =>
        dispatch(
          addArtistToPlaylist({
            playlistId: item.id,
            artistId: menuItem.props.data.id,
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
        dispatch(addArtistToPlaylist({ artistId: menuItem.props.data.id }))
      }
    >
      + Create new playlist
    </Item>
  )

  return (
    <ContextMenu id="artist-context-menu">
      <Item
        onClick={(menuItem: any) =>
          dispatch(playArtist(menuItem.props.data.id))
        }
      >
        Play now
      </Item>
      <Item
        onClick={(menuItem: any) =>
          dispatch(playArtistAfterCurrent(menuItem.props.data.id))
        }
      >
        Play after current track
      </Item>
      <Item
        onClick={(menuItem: any) => dispatch(addArtist(menuItem.props.data.id))}
      >
        Add to queue
      </Item>
      <Separator />
      <Submenu label="Add to playlist...">{playlistsItems}</Submenu>
    </ContextMenu>
  )
}

export default ArtistContextMenu
