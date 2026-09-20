import ContextMenu from 'common/components/ContextMenu'
import usePlaylistItemContextualActions from 'modules/collections/hooks/usePlaylistItemContextualActions'

type Props = {
  id?: string
  onHidden?: () => void
}

export default function PlaylistTrackContextMenu({
  id = 'playlist-track-context-menu',
  onHidden,
}: Props) {
  const actionItems = usePlaylistItemContextualActions()

  return <ContextMenu id={id} menuItems={actionItems} onHidden={onHidden} />
}
