import React from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import ActionButton from 'common/components/ActionButton'
import { queueClear } from 'modules/player/redux'
import { contextMenu } from 'react-contexify'
import { RootState } from '../../../store/types'
import ActionButtonIcon from '../../../common/components/ActionButtonIcon'
import QueueActionsMoreContextMenu from './QueueActionsMoreContextMenu'

const NowPlayingQueueActions = () => {
  const { items } = useSelector((state: RootState) => state.queue)
  const dispatch = useDispatch()

  const handleQueueActionsMore = (e: React.MouseEvent) => {
    e.preventDefault()
    contextMenu.show({
      id: 'queue-actions-more-menu',
      event: e,
      props: {
        items,
      },
    })
  }

  return (
    <QueueActionsWrapper>
      <ActionButton onClick={() => dispatch(queueClear())} icon="close">
        Clear
      </ActionButton>
      <QueueActionButton
        icon="more_horiz"
        size={25}
        onClick={handleQueueActionsMore}
        testId="queue-actions-more"
      />
      <QueueActionsMoreContextMenu />
    </QueueActionsWrapper>
  )
}

export default NowPlayingQueueActions

const QueueActionsWrapper = styled.div`
  display: flex;
  align-items: center;
`
const QueueActionButton = styled(ActionButtonIcon)`
  margin-left: 10px;
  padding: 0;
  color: ${(props) => props.theme.buttons.color};

  :hover {
    color: ${(props) => props.theme.buttons.colorHover};
  }
`
