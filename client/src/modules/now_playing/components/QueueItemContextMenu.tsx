import { Item, Menu as ContextMenu, Separator, Submenu } from 'react-contexify'
import 'react-contexify/dist/ReactContexify.min.css'
import {
  playerTogglePlayPause,
  queueRemoveTrack,
  setItemFromQueue,
} from 'modules/player/store/store'
import { useNavigate } from 'react-router'
import { useAppDispatch } from 'store/hooks'
import { useTranslation } from 'react-i18next'
import { useGetCollectionsQuery } from 'modules/collections/services/api'
import { useAddTrackToPlaylist } from 'modules/collections/services/services'
import { search, setSearchFilter } from '../../browser/store'

function QueueItemContextMenu() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { data: { playlists = [] } = {} } = useGetCollectionsQuery()
  const addTrackToPlaylist = useAddTrackToPlaylist()

  const findAllByArtist = (menuItem: any) => {
    dispatch(setSearchFilter('artist'))
    dispatch(search(menuItem.props.data.track?.artist?.name))
    navigate('/library')
  }

  const findAllByAlbum = (menuItem: any) => {
    dispatch(setSearchFilter('album'))
    dispatch(search(menuItem.props.data.track?.album?.title))
    navigate('/library')
  }

  const handlePlayTrack = (position: number) => {
    dispatch(setItemFromQueue(position))
    dispatch(playerTogglePlayPause(true))
  }

  const handleAddTrackToPlaylist = (menuItem: any, playlist: Playlist) => {
    addTrackToPlaylist({
      playlistId: playlist.id,
      trackId: menuItem.props.data.track?.id,
    })
  }

  const playlistsItems = playlists.map((item: Playlist) => (
    <Item
      key={item.id}
      // @ts-ignore
      onClick={(menuItem) => handleAddTrackToPlaylist(menuItem, item)}
    >
      {item.title}
    </Item>
  ))
  playlistsItems.push(
    <Item
      key="new"
      onClick={(menuItem: any) =>
        dispatch(addTrackToPlaylist({ trackId: menuItem.props.data.track.id }))
      }
    >
      {t('playlists.actions.createNewPlaylist')}
    </Item>
  )

  return (
    <ContextMenu id="queue-item-context-menu">
      <Item
        // @ts-ignore
        onClick={(menuItem: any) =>
          handlePlayTrack(menuItem.props.data.position - 1)
        }
      >
        {t('player.queueActions.playTrack')}
      </Item>
      <Item
        // @ts-ignore
        onClick={(menuItem: any) =>
          dispatch(queueRemoveTrack(menuItem.props.data.position - 1))
        }
      >
        {t('player.queueActions.removeTrack')}
      </Item>
      <Separator />
      <Submenu label={t('playlists.actions.addToPlaylist')}>
        {playlistsItems}
      </Submenu>
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

export default QueueItemContextMenu
