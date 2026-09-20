import ContextMenu from 'common/components/ContextMenu'
import useDiscContextualActions from 'modules/browser/hooks/useDiscContextualActions'

export default function DiscContextMenu() {
  const actionItems = useDiscContextualActions()

  return <ContextMenu id="disc-context-menu" menuItems={actionItems} />
}
