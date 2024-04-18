import { Item, Menu as ContextMenu, Separator, Submenu } from 'react-contexify'
import 'react-contexify/dist/ReactContexify.min.css'
import {
  addTrack,
  playTrack,
  playTrackAfterCurrent,
} from 'modules/player/store/store'
import { useNavigate } from 'react-router'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { useTranslation } from 'react-i18next'
import { useGetCollectionsQuery } from 'modules/collections/services/api'
import {
  useAddTrackToPlaylist,
  useRemoveTrackFromPlaylist,
} from 'modules/collections/services/services'
import { search, setSearchFilter } from '../../browser/store'

function PlaylistTrackContextMenu() {
  const { t } = useTranslation()

  const { data: { playlists = [] } = {} } = useGetCollectionsQuery()
  const currentPlaylistId = useAppSelector(
    (state) => state.playlist.currentPlaylist
  )

  const addTrackToPlaylist = useAddTrackToPlaylist()
  const removeTrackFromPlaylist = useRemoveTrackFromPlaylist()

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
        addTrackToPlaylist({
          playlistId: item.id,
          trackId: menuItem.props.data.track.id,
        })
      }
    >
      {item.title}
    </Item>
  ))
  playlistsItems.push(
    <Item
      key="new"
      onClick={(menuItem: any) =>
        addTrackToPlaylist({ trackId: menuItem.props.data.track.id })
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
          removeTrackFromPlaylist(
            menuItem.props.data.position,
            currentPlaylistId
          )
        }
      >
        {t('playlists.actions.removeFromPlaylist')}
      </Item>
      <Separator />
      <Item onClick={(menuItem: any) => findAllByArtist(menuItem)}>
        {t('browser.actions.findAllByArtist')}
      </Item>
      <Item onClick={(menuItem: any) => findAllByAlbum(menuItem)}>
        {t('browser.actions.findAllOnAlbum')}
      </Item>
    </ContextMenu>
  )
}

export default PlaylistTrackContextMenu
