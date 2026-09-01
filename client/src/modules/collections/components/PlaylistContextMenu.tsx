import ContextMenu from 'common/components/ContextMenu'
import usePlaylistContextualActions from 'modules/collections/hooks/usePlaylistContextualActions'

type Props = {
  id?: string
  onHidden?: () => void
}

export default function PlaylistContextMenu({
  id = 'playlist-context-menu',
  onHidden,
}: Props) {
  const actionItems = usePlaylistContextualActions()

  return <ContextMenu id={id} menuItems={actionItems} onHidden={onHidden} />
}
