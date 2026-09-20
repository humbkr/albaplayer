import ContextMenu from 'common/components/ContextMenu'
import useAlbumContextualActions from 'modules/browser/hooks/useAlbumContextualActions'

type Props = {
  id?: string
  onHidden?: () => void
}

export default function AlbumContextMenu({
  id = 'album-context-menu',
  onHidden,
}: Props) {
  const actionItems = useAlbumContextualActions()

  return <ContextMenu id={id} menuItems={actionItems} onHidden={onHidden} />
}
