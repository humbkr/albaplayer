import { Item, Menu as ContextMenu, Submenu } from 'react-contexify'
import 'react-contexify/dist/ReactContexify.min.css'
import { useTranslation } from 'react-i18next'
import { useGetCollectionsQuery } from 'modules/collections/services/api'
import { useAddCurrentQueueToPlaylist } from 'modules/collections/services/services'

function QueueActionsMoreContextMenu() {
  const { t } = useTranslation()

  const { data: { playlists = [] } = {} } = useGetCollectionsQuery()
  const addCurrentQueueToPlaylist = useAddCurrentQueueToPlaylist()

  const playlistsItems = playlists.map((item) => (
    <Item
      key={item.id}
      onClick={(menuItem: any) =>
        addCurrentQueueToPlaylist(menuItem.props.data.id)
      }
    >
      {item.title}
    </Item>
  ))
  playlistsItems.push(
    <Item key="new" onClick={() => addCurrentQueueToPlaylist()}>
      {t('playlists.actions.createNewPlaylist')}
    </Item>
  )

  return (
    <ContextMenu id="queue-actions-more-menu">
      <Submenu label={t('playlists.actions.addToPlaylist')}>
        {playlistsItems}
      </Submenu>
    </ContextMenu>
  )
}

export default QueueActionsMoreContextMenu
