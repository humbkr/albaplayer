import ContextMenu from 'common/components/ContextMenu'
import useTrackContextualActions from 'modules/browser/hooks/useTrackContextualActions'

type Props = {
  id?: string
  onHidden?: () => void
}

export default function TrackContextMenu({
  id = 'track-context-menu',
  onHidden,
}: Props) {
  const actionItems = useTrackContextualActions()

  return <ContextMenu id={id} menuItems={actionItems} onHidden={onHidden} />
}
