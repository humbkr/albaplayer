import ContextMenu from 'common/components/ContextMenu'
import useQueueItemContextualActions from 'modules/now_playing/hooks/useQueueItemContextualActions'

function QueueItemContextMenu() {
  const actionItems = useQueueItemContextualActions()

  return <ContextMenu id="queue-item-context-menu" menuItems={actionItems} />
}

export default QueueItemContextMenu
