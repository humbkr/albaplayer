import React from 'react'
import styled from 'styled-components'
import ActionButton from 'common/components/ActionButton'
import { queueClear } from 'modules/player/store/store'
import { contextMenu } from 'react-contexify'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { useTranslation } from 'react-i18next'
import ActionButtonIcon from '../../../common/components/ActionButtonIcon'
import QueueActionsMoreContextMenu from './QueueActionsMoreContextMenu'

const NowPlayingQueueActions = () => {
  const { t } = useTranslation()

  const { items } = useAppSelector((state) => state.queue)
  const dispatch = useAppDispatch()

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
        {t('common.clear')}
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
