import { Item, Menu as ContextMenu, Separator, Submenu } from 'react-contexify'
import 'react-contexify/dist/ReactContexify.min.css'
import { useAppDispatch } from 'store/hooks'
import { useTranslation } from 'react-i18next'
import { useGetCollectionsQuery } from 'modules/collections/services/api'
import { useAddTrackToPlaylist } from 'modules/collections/services/services'
import {
  useAddTrack,
  usePlayTrack,
  usePlayTrackAfterCurrent,
} from 'modules/browser/services'
import { search, setSearchFilter } from '../store'

function TrackContextMenu() {
  const { t } = useTranslation()

  const { data: { playlists = [] } = {} } = useGetCollectionsQuery()
  const addTrackToPlaylist = useAddTrackToPlaylist()
  const dispatch = useAppDispatch()

  const playTrack = usePlayTrack()
  const addTrack = useAddTrack()
  const playTrackAfterCurrent = usePlayTrackAfterCurrent()

  const playNow = (menuItem: any) => {
    playTrack(menuItem.props.data.id)
  }
  const playAfter = (menuItem: any) => {
    playTrackAfterCurrent(menuItem.props.data.id)
  }
  const playLast = (menuItem: any) => {
    addTrack(menuItem.props.data.id)
  }

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
      <Item onClick={playNow}>{t('player.actions.playNow')}</Item>
      <Item onClick={playAfter}>{t('player.actions.playAfter')}</Item>
      <Item onClick={playLast}>{t('player.actions.addToQueue')}</Item>
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
