import { Item, Menu as ContextMenu, Separator, Submenu } from 'react-contexify'
import 'react-contexify/dist/ReactContexify.min.css'
import { addAlbum, playAlbum, playAlbumAfterCurrent } from 'modules/player/store/store'
import { useAppDispatch } from 'store/hooks'
import { useTranslation } from 'react-i18next'
import { useGetCollectionsQuery } from 'modules/collections/services/api'
import { useAddAlbumToPlaylist } from 'modules/collections/services/services'

function ConditionalItem({ children, ...props }: any) {
  if (!props.propsFromTrigger.displayAllActions) {
    return null
  }

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Item {...props}>{children}</Item>
}

type Props = {
  menuId: string
  onHidden: () => void
}

function AlbumMoreActionsContextMenu({ menuId, onHidden }: Props) {
  const { t } = useTranslation()

  const { data: { playlists = [] } = {} } = useGetCollectionsQuery()
  const addAlbumToPlaylist = useAddAlbumToPlaylist()
  const dispatch = useAppDispatch()

  const playlistsItems = playlists.map((item) => (
    <Item
      key={item.id}
      onClick={(menuItem: any) =>
        addAlbumToPlaylist({
          playlistId: item.id,
          albumId: menuItem.props.album.id,
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
        addAlbumToPlaylist({ albumId: menuItem.props.album.id })
      }
    >
      {t('playlists.actions.createNewPlaylist')}
    </Item>
  )

  return (
    <ContextMenu id={menuId} onHidden={onHidden}>
      <ConditionalItem
        onClick={(menuItem: any) =>
          dispatch(playAlbum(menuItem.props.album.id))
        }
      >
        {t('player.actions.playNow')}
      </ConditionalItem>
      <Item
        onClick={(menuItem: any) =>
          dispatch(playAlbumAfterCurrent(menuItem.props.album.id))
        }
      >
        {t('player.actions.playAfter')}
      </Item>
      <Item
        onClick={(menuItem: any) => dispatch(addAlbum(menuItem.props.album.id))}
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

export default AlbumMoreActionsContextMenu
