import { useTranslation } from 'react-i18next'
import { useAppDispatch } from 'store/hooks'
import { useNavigate } from 'react-router'
import {
  playerTogglePlayPause,
  queueRemoveTrack,
  setItemFromQueue,
} from 'modules/player/store/store'
import { search, setSearchFilter } from 'modules/browser/store'
import { notify } from 'common/utils/notifications'
import useAddToPlaylistsContextualAction from 'modules/collections/hooks/useAddToPlaylistsContextualAction'

export default function useQueueItemContextualActions(): ContextualActionsItem<QueueItemDisplay>[] {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handlePlayTrack: ContextualAction<QueueItemDisplay> = ({
    position,
    track,
  }) => {
    dispatch(setItemFromQueue(position - 1))
    dispatch(playerTogglePlayPause(true))
    notify(t('notifications.nowPlaying', { itemName: track.title }))
  }

  const handleRemoveTrack: ContextualAction<QueueItemDisplay> = ({
    position,
    track,
  }) => {
    dispatch(queueRemoveTrack(position - 1))
    notify(t('notifications.removedFromQueue', { itemName: track.title }))
  }

  const handleFindAllByArtist: ContextualAction<QueueItemDisplay> = ({
    track,
  }) => {
    dispatch(setSearchFilter('artist'))
    dispatch(search(track?.artist?.name ?? ''))
    navigate('/library')
  }

  const handleFindAllOnAlbum: ContextualAction<QueueItemDisplay> = ({
    track,
  }) => {
    dispatch(setSearchFilter('album'))
    dispatch(search(track?.album?.title ?? ''))
    navigate('/library')
  }

  return [
    {
      id: 'queue-item-play',
      type: 'item',
      label: t('player.queueActions.playTrack'),
      action: handlePlayTrack,
    },
    {
      id: 'queue-item-remove',
      type: 'item',
      label: t('player.queueActions.removeTrack'),
      action: handleRemoveTrack,
    },
    { type: 'separator' },
    useAddToPlaylistsContextualAction<QueueItemDisplay>('queueItem'),
    { type: 'separator' },
    {
      id: 'queue-item-find-all-by-artist',
      type: 'item',
      label: t('browser.actions.findAllByArtist'),
      action: handleFindAllByArtist,
    },
    {
      id: 'queue-item-find-all-on-album',
      type: 'item',
      label: t('browser.actions.findAllOnAlbum'),
      action: handleFindAllOnAlbum,
    },
  ]
}
