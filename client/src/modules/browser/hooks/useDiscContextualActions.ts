import { useTranslation } from 'react-i18next'
import {
  useAddAlbumDisc,
  usePlayAlbumDisc,
  usePlayAlbumDiscAfterCurrent,
} from 'modules/browser/services'
import { notify } from 'common/utils/notifications'
import useAddToPlaylistsContextualAction from 'modules/collections/hooks/useAddToPlaylistsContextualAction'

type AlbumDisc = { albumId: string; disc: string }

export default function useDiscContextualActions(): ContextualActionsItem<AlbumDisc>[] {
  const { t } = useTranslation()

  const playAlbumDisc = usePlayAlbumDisc()
  const playAlbumDiscAfterCurrent = usePlayAlbumDiscAfterCurrent()
  const addAlbumDisc = useAddAlbumDisc()

  const discName = (disc: string) => t('browser.album.disc', { disc })

  const handlePlayNow: ContextualAction<AlbumDisc> = ({ albumId, disc }) => {
    playAlbumDisc(albumId, disc)
    notify(t('notifications.nowPlaying', { itemName: discName(disc) }))
  }
  const handlePlayAfter: ContextualAction<AlbumDisc> = ({ albumId, disc }) => {
    playAlbumDiscAfterCurrent(albumId, disc)
    notify(t('notifications.playingNext', { itemName: discName(disc) }))
  }
  const handleAddToQueue: ContextualAction<AlbumDisc> = ({ albumId, disc }) => {
    addAlbumDisc(albumId, disc)
    notify(t('notifications.addedToQueue', { itemName: discName(disc) }))
  }

  return [
    {
      id: 'disc-play-now',
      type: 'item',
      label: t('player.actions.playNow'),
      action: handlePlayNow,
    },
    {
      id: 'disc-play-after',
      type: 'item',
      label: t('player.actions.playAfter'),
      action: handlePlayAfter,
    },
    {
      id: 'disc-play-last',
      type: 'item',
      label: t('player.actions.addToQueue'),
      action: handleAddToQueue,
    },
    { type: 'separator' },
    useAddToPlaylistsContextualAction<AlbumDisc>('disc'),
  ]
}
