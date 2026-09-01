import { useTranslation } from 'react-i18next'
import {
  useAddAlbum,
  useFindAllByArtist,
  usePlayAlbum,
  usePlayAlbumAfterCurrent,
} from 'modules/browser/services'
import { notify } from 'common/utils/notifications'
import useAddToPlaylistsContextualAction from 'modules/collections/hooks/useAddToPlaylistsContextualAction'

export default function useAlbumContextualActions(): ContextualActionsItem<Album>[] {
  const { t } = useTranslation()

  const playAlbum = usePlayAlbum()
  const playAlbumAfterCurrent = usePlayAlbumAfterCurrent()
  const addAlbum = useAddAlbum()
  const findAllByArtist = useFindAllByArtist()

  const handlePlayItem: ContextualAction<Album> = ({ id, title }) => {
    playAlbum(id)
    notify(t('notifications.nowPlaying', { itemName: title }))
  }
  const handlePlayItemAfterCurrent: ContextualAction<Album> = ({ id, title }) => {
    playAlbumAfterCurrent(id)
    notify(t('notifications.playingNext', { itemName: title }))
  }
  const handleAddItem: ContextualAction<Album> = ({ id, title }) => {
    addAlbum(id)
    notify(t('notifications.addedToQueue', { itemName: title }))
  }

  const handleFindAllByArtist: ContextualAction<Album> = ({ artist }) => {
    findAllByArtist(artist?.id as string)
  }

  return [
    {
      id: 'album-play-now',
      type: 'item',
      label: t('player.actions.playNow'),
      action: handlePlayItem,
    },
    {
      id: 'album-play-after',
      type: 'item',
      label: t('player.actions.playAfter'),
      action: handlePlayItemAfterCurrent,
    },
    {
      id: 'album-play-last',
      type: 'item',
      label: t('player.actions.addToQueue'),
      action: handleAddItem,
    },
    {
      type: 'separator',
    },
    useAddToPlaylistsContextualAction<Album>('album'),
    {
      type: 'separator',
    },
    {
      id: 'album-find-all-by-artist',
      type: 'item',
      label: t('browser.actions.findAllByArtist'),
      action: handleFindAllByArtist,
    },
  ]
}
