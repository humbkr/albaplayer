import Modal from 'common/components/layout/Modal'
import { useTranslation } from 'react-i18next'
import { useRef } from 'react'
import PlaylistEditForm, {
  PlaylistEditFormData,
} from 'modules/playlist/components/PlaylistEditForm'
import {
  playlistCreatePlaylist,
  playlistUpdateInfo,
} from 'modules/playlist/store'
import { useAppDispatch } from 'store/hooks'
import { getRandomInt } from 'common/utils/utils'
import dayjs from 'dayjs'

type Props = {
  playlist?: Playlist
  isOpen: boolean
  onClose: () => void
}

function PlaylistEditModal({ playlist, isOpen, onClose }: Props) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const formRef = useRef<HTMLFormElement | null>(null)

  const onValidate = () => {
    formRef.current?.dispatchEvent(
      new Event('submit', { cancelable: true, bubbles: true })
    )
  }

  const onSubmit = async (data: PlaylistEditFormData) => {
    if (playlist) {
      dispatch(
        playlistUpdateInfo({
          ...playlist,
          title: data.title,
        })
      )
    } else {
      dispatch(
        playlistCreatePlaylist({
          id: `temp_${getRandomInt(1, 100000)}`,
          title: data.title,
          date: dayjs().format('YYYY-MM-DD'),
          items: [],
        })
      )
    }

    onClose()
  }

  const title = playlist
    ? t('playlists.actions.editPlaylist')
    : t('playlists.actions.createANewPlaylist')
  const actionLabel = playlist ? t('common.edit') : t('common.create')

  return (
    <Modal
      id="playlist-edit-modal"
      isOpen={isOpen}
      onClose={onClose}
      onValidate={onValidate}
      title={title}
      cancelActionLabel={t('playlists.actions.cancel')}
      mainActionLabel={actionLabel}
    >
      <PlaylistEditForm
        formRef={formRef}
        playlist={playlist}
        onSubmit={onSubmit}
      />
    </Modal>
  )
}

export default PlaylistEditModal
