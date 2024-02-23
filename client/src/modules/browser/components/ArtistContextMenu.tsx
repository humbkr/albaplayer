import { Item, Menu as ContextMenu, Separator, Submenu } from 'react-contexify'
import 'react-contexify/dist/ReactContexify.min.css'
import { addArtist, playArtist, playArtistAfterCurrent } from 'modules/player/store/store'
import { useAppDispatch } from 'store/hooks'
import { useTranslation } from 'react-i18next'
import { useGetCollectionsQuery } from 'modules/collections/services/api'
import { useAddArtistToPlaylist } from 'modules/collections/services/services'

function ArtistContextMenu() {
  const { t } = useTranslation()

  const { data: { playlists = [] } = {} } = useGetCollectionsQuery()
  const addArtistToPlaylist = useAddArtistToPlaylist()
  const dispatch = useAppDispatch()

  const playlistsItems = playlists.map((item: Playlist) => (
    <Item
      key={item.id}
      onClick={(menuItem: any) =>
        addArtistToPlaylist({
          playlistId: item.id,
          artistId: menuItem.props.data.id,
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
        addArtistToPlaylist({ artistId: menuItem.props.data.id })
      }
    >
      {t('playlists.actions.createNewPlaylist')}
    </Item>
  )

  return (
    <ContextMenu id="artist-context-menu">
      <Item
        onClick={(menuItem: any) =>
          dispatch(playArtist(menuItem.props.data.id))
        }
      >
        {t('player.actions.playNow')}
      </Item>
      <Item
        onClick={(menuItem: any) =>
          dispatch(playArtistAfterCurrent(menuItem.props.data.id))
        }
      >
        {t('player.actions.playAfter')}
      </Item>
      <Item
        onClick={(menuItem: any) => dispatch(addArtist(menuItem.props.data.id))}
      >
        {t('player.actions.addToQueue')}
      </Item>
      <Separator />
      <Submenu label={t('playlists.actions.addToPlaylist')}>
        {playlistsItems}
      </Submenu>
    </ContextMenu>
  )
}

export default ArtistContextMenu
