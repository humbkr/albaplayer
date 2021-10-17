import React, { FunctionComponent } from 'react'
import styled from 'styled-components'
import { MenuProvider as ContextMenuProvider } from 'react-contexify'
import { useDispatch, useSelector } from 'react-redux'
import ActionButtonIcon from 'common/components/ActionButtonIcon'
import {
  playerTogglePlayPause,
  queueRemoveTrack,
  setItemFromQueue,
} from 'modules/player/redux'
import { RootState } from 'store/types'
import QueueItemDisplay from '../types/QueueItemDisplay'

const NowPlayingQueueItem: FunctionComponent<{
  item: QueueItemDisplay
  currentIndex: number
  style: {}
}> = ({ item, currentIndex, style }) => {
  const isPlaying = useSelector((state: RootState) => state.player.playing)
  const dispatch = useDispatch()

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

  const isCurrent = currentIndex + 1 === item.position
  const playbackButtonIcon = isCurrent && isPlaying ? 'pause' : 'play_arrow'

  return (
    <ContextMenuProvider style={style} id="queue-item-context-menu" data={item}>
      <QueueItemWrapper isCurrent={isCurrent}>
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
    </ContextMenuProvider>
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
  border-bottom: 1px solid ${(props) => props.theme.separatorColor};
  ${(props) => (props.isCurrent ? 'font-weight: bold' : '')};
  background-color: ${(props) => props.theme.backgroundColor};

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
