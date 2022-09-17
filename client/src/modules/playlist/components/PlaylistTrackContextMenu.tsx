import React from 'react'
import { Menu as ContextMenu, Item, Submenu, Separator } from 'react-contexify'
import 'react-contexify/dist/ReactContexify.min.css'
import {
  addTrack,
  playTrack,
  playTrackAfterCurrent,
} from 'modules/player/store/store'
import {
  playlistsSelector,
  playlistRemoveTrack,
  addTrack as addTrackToPlaylist,
} from 'modules/playlist/store'
import { useNavigate } from 'react-router'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { useTranslation } from 'react-i18next'
import { search, setSearchFilter } from '../../browser/store'

const PlaylistTrackContextMenu = () => {
  const { t } = useTranslation()

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
      {t('playlists.actions.createNewPlaylist')}
    </Item>
  )

  return (
    <ContextMenu id="playlist-track-context-menu">
      <Item
        onClick={(menuItem: any) =>
          dispatch(playTrack(menuItem.props.data.track.id))
        }
      >
        {t('player.actions.playNow')}
      </Item>
      <Item
        onClick={(menuItem: any) =>
          dispatch(playTrackAfterCurrent(menuItem.props.data.track.id))
        }
      >
        {t('player.actions.playAfter')}
      </Item>
      <Item
        onClick={(menuItem: any) =>
          dispatch(addTrack(menuItem.props.data.track.id))
        }
      >
        {t('player.actions.addToQueue')}
      </Item>
      <Separator />
      <Submenu label={t('playlists.actions.addToPlaylist')}>
        {playlistsItems}
      </Submenu>
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
        {t('playlists.actions.removeFromPlaylist')}
      </Item>
      <Separator />
      <Item onClick={(menuItem: any) => findAllByArtist(menuItem)}>
        {t('library.actions.findAllByArtist')}
      </Item>
      <Item onClick={(menuItem: any) => findAllByAlbum(menuItem)}>
        {t('library.actions.findAllOnAlbum')}
      </Item>
    </ContextMenu>
  )
}

export default PlaylistTrackContextMenu
