import ContextMenu from 'common/components/ContextMenu'
import useQueueActionsContextualActions from 'modules/now_playing/hooks/useQueueActionsContextualActions'

function QueueActionsMoreContextMenu() {
  const actionItems = useQueueActionsContextualActions()

  return <ContextMenu id="queue-actions-more-menu" menuItems={actionItems} />
}

export default QueueActionsMoreContextMenu
