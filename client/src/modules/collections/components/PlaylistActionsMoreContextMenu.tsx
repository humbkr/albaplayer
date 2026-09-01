import ContextMenu from 'common/components/ContextMenu'
import usePlaylistActionsContextualActions from 'modules/collections/hooks/usePlaylistActionsContextualActions'

function PlaylistActionsMoreContextMenu() {
  const actionItems = usePlaylistActionsContextualActions()

  return <ContextMenu id="playlist-actions-more-menu" menuItems={actionItems} />
}

export default PlaylistActionsMoreContextMenu
