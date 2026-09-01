import { useTranslation } from 'react-i18next'
import { useGetCollectionsQuery } from 'modules/collections/services/api'
import { useAddCurrentQueueToPlaylist } from 'modules/collections/services/services'
import { notify } from 'common/utils/notifications'

export default function useQueueActionsContextualActions(): ContextualActionsItem[] {
  const { t } = useTranslation()
  const { data: { playlists = [] } = {} } = useGetCollectionsQuery()
  const addCurrentQueueToPlaylist = useAddCurrentQueueToPlaylist()

  return [
    {
      id: 'queue-add-to-playlist',
      type: 'subMenu',
      label: t('collections.playlists.actions.addToPlaylist'),
      subActions: [
        ...playlists.map((playlist: Playlist) => ({
          id: playlist.id,
          type: 'item' as ContextualActionsItem['type'],
          label: playlist.title,
          action: () => {
            addCurrentQueueToPlaylist(playlist.id)
            notify(t('notifications.queueAddedToPlaylist', { playlistName: playlist.title }))
          },
        })),
        {
          id: 'create-new-playlist',
          type: 'item' as ContextualActionsItem['type'],
          label: t('collections.playlists.actions.createNewPlaylist'),
          action: () => {
            addCurrentQueueToPlaylist(null)
            notify(t('notifications.queueAddedToNewPlaylist'))
          },
        },
      ],
    },
  ]
}
