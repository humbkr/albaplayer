import { Item, Menu as ContextMenu, Separator, Submenu } from 'react-contexify'
import 'react-contexify/dist/ReactContexify.min.css'
import { useAppDispatch } from 'store/hooks'
import { useTranslation } from 'react-i18next'
import { useGetCollectionsQuery } from 'modules/collections/services/api'
import { useAddAlbumToPlaylist } from 'modules/collections/services/services'
import {
  useAddAlbum,
  usePlayAlbum,
  usePlayAlbumAfterCurrent,
} from 'modules/browser/services'
import { search, setSearchFilter } from '../store'

function AlbumContextMenu() {
  const { t } = useTranslation()
  const { data: { playlists = [] } = {} } = useGetCollectionsQuery()
  const addAlbumToPlaylist = useAddAlbumToPlaylist()
  const dispatch = useAppDispatch()

  const playAlbum = usePlayAlbum()
  const playAlbumAfterCurrent = usePlayAlbumAfterCurrent()
  const addAlbum = useAddAlbum()

  const playNow = (menuItem: any) => {
    playAlbum(menuItem.props.data.id)
  }
  const playAfter = (menuItem: any) => {
    playAlbumAfterCurrent(menuItem.props.data.id)
  }
  const playLast = (menuItem: any) => {
    addAlbum(menuItem.props.data.id)
  }

  const findAllByArtist = (menuItem: any) => {
    dispatch(setSearchFilter('artist'))
    dispatch(search(menuItem.props.data.artist?.name))
  }

  const playlistsItems = playlists.map((item: Playlist) => (
    <Item
      key={item.id}
      onClick={(menuItem: any) =>
        addAlbumToPlaylist({
          playlistId: item.id,
          albumId: menuItem.props.data.id,
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
        addAlbumToPlaylist({ albumId: menuItem.props.data.id })
      }
    >
      {t('playlists.actions.createNewPlaylist')}
    </Item>
  )

  return (
    <ContextMenu id="album-context-menu">
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
    </ContextMenu>
  )
}

export default AlbumContextMenu
