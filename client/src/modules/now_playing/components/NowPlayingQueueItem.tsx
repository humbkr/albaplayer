import React from 'react'
import styled from 'styled-components'
import { contextMenu } from 'react-contexify'
import ActionButtonIcon from 'common/components/ActionButtonIcon'
import {
  playerTogglePlayPause,
  queueRemoveTrack,
  setItemFromQueue,
} from 'modules/player/store/store'
import { useAppDispatch, useAppSelector } from 'store/hooks'

type Props = {
  item: QueueItemDisplay
  currentIndex: number
}

function NowPlayingQueueItem({ item, currentIndex }: Props) {
  const isPlaying = useAppSelector((state) => state.player.playing)
  const dispatch = useAppDispatch()

  const handlePlayBackButton = () => {
    const isCurrent = currentIndex + 1 === item.position

    if (isCurrent && isPlaying) {
      // Pause playback.
      dispatch(playerTogglePlayPause(false))
    } else if (isCurrent) {
      // Resume playback.
      dispatch(playerTogglePlayPause(true))
    } else {
      dispatch(setItemFromQueue(item.position - 1))
      dispatch(playerTogglePlayPause(true))
    }
  }

  const handleRemoveTrack = () => {
    dispatch(queueRemoveTrack(item.position - 1))
  }

  const onRightClick = (e: React.MouseEvent) => {
    e.preventDefault()
    contextMenu.show({
      id: 'queue-item-context-menu',
      event: e,
      props: {
        data: item,
      },
    })
  }

  const isCurrent = currentIndex + 1 === item.position
  const playbackButtonIcon = isCurrent && isPlaying ? 'pause' : 'play_arrow'

  return (
    <QueueItemWrapper isCurrent={isCurrent} onContextMenu={onRightClick}>
      <QueueItemFirstColumn>
        <QueueItemPosition>{item.position}</QueueItemPosition>
        <QueueActionButtonIcon
          icon={playbackButtonIcon}
          onClick={handlePlayBackButton}
        />
      </QueueItemFirstColumn>
      <div>{item.track.title}</div>
      <QueueItemInfo>{item.track.artist?.name}</QueueItemInfo>
      <QueueItemActions>
        <ActionButtonIcon icon="delete" onClick={handleRemoveTrack} />
      </QueueItemActions>
    </QueueItemWrapper>
  )
}

export default NowPlayingQueueItem

const QueueActionButtonIcon = styled(ActionButtonIcon)`
  display: none;
  color: ${(props) => props.theme.buttons.color};

  :hover {
    color: ${(props) => props.theme.buttons.colorHover};
  }
`
const QueueItemActions = styled.div`
  display: none;
  vertical-align: middle;
  text-align: right;
  color: ${(props) => props.theme.textSecondaryColor};
`
const QueueItemPosition = styled.div``
const QueueItemWrapper = styled.div<{ isCurrent: boolean }>`
  display: grid;
  grid-template-columns: 60px 40% auto 44px;
  height: ${(props) => props.theme.itemHeight};
  color: ${(props) => props.theme.textPrimaryColor};
  border-bottom: 1px solid ${(props) => props.theme.separatorColor};
  ${(props) => (props.isCurrent ? 'font-weight: bold' : '')};

  > * {
    align-self: center;
  }

  :hover {
    background-color: ${(props) => props.theme.highlight};

    ${QueueItemPosition} {
      display: none;
    }

    ${QueueActionButtonIcon}, ${QueueItemActions} {
      display: block;
    }
  }
`
const QueueItemFirstColumn = styled.div`
  justify-self: center;
  color: ${(props) => props.theme.textSecondaryColor};
`
const QueueItemInfo = styled.div`
  font-weight: normal;
`
