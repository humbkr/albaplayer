import ContextMenu from 'common/components/ContextMenu'
import useArtistContextualActions from 'modules/browser/hooks/useArtistContextualActions'

type Props = {
  id?: string
  onHidden?: () => void
}

export default function ArtistContextMenu({
  id = 'artist-context-menu',
  onHidden,
}: Props) {
  const actionItems = useArtistContextualActions()

  return <ContextMenu id={id} menuItems={actionItems} onHidden={onHidden} />
}
