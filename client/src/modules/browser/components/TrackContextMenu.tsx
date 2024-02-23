import { Item, Menu as ContextMenu, Separator, Submenu } from 'react-contexify'
import 'react-contexify/dist/ReactContexify.min.css'
import { addTrack, playTrack, playTrackAfterCurrent } from 'modules/player/store/store'
import { useAppDispatch } from 'store/hooks'
import { useTranslation } from 'react-i18next'
import { useGetCollectionsQuery } from 'modules/collections/services/api'
import { useAddTrackToPlaylist } from 'modules/collections/services/services'
import { search, setSearchFilter } from '../store'

function TrackContextMenu() {
  const { t } = useTranslation()

  const { data: { playlists = [] } = {} } = useGetCollectionsQuery()
  const addTrackToPlaylist = useAddTrackToPlaylist()
  const dispatch = useAppDispatch()

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
      onClick={(menuItem: any) =>
        addTrackToPlaylist({
          playlistId: item.id,
          trackId: menuItem.props.data.id,
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
        addTrackToPlaylist({ trackId: menuItem.props.data.id })
      }
    >
      {t('playlists.actions.createNewPlaylist')}
    </Item>
  )

  return (
    <ContextMenu id="track-context-menu">
      <Item
        onClick={(menuItem: any) => dispatch(playTrack(menuItem.props.data.id))}
      >
        {t('player.actions.playNow')}
      </Item>
      <Item
        onClick={(menuItem: any) =>
          dispatch(playTrackAfterCurrent(menuItem.props.data.id))
        }
      >
        {t('player.actions.playAfter')}
      </Item>
      <Item
        onClick={(menuItem: any) => dispatch(addTrack(menuItem.props.data.id))}
      >
        {t('player.actions.addToQueue')}
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

export default TrackContextMenu
