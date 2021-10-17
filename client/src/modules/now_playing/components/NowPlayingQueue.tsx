import React, { FunctionComponent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled, { withTheme } from 'styled-components'
import { queueReplace, queueSetCurrent } from 'modules/player/redux'
import { RootState } from 'store/types'
import { AppTheme } from 'themes/types'
import { QueueItem } from 'modules/player/types'
import NowPlayingQueueHeader from './NowPlayingQueueHeader'
import NowPlayingQueueList from './NowPlayingQueueList'
import NowPlayingQueueActions from './NowPlayingQueueActions'
import QueueItemContextMenu from './QueueItemContextMenu'
import QueueItemDisplay from '../types/QueueItemDisplay'

const NowPlayingQueue: FunctionComponent<{ theme: AppTheme }> = ({ theme }) => {
  const { items, current } = useSelector((state: RootState) => state.queue)
  const dispatch = useDispatch()

  // Add a position info to each playlist item.
  const itemsForDisplay: QueueItemDisplay[] = items.map(
    (item: QueueItem, index: number) => ({ ...item, position: index + 1 })
  )

  const handleUpdateQueue = (
    newQueue: QueueItemDisplay[],
    newCurrentTrackIndex: number
  ) => {
    // Cast QueueItemDisplay[] to QueueItem[].
    const queueItems = newQueue.map((item) => ({ track: item.track }))

    dispatch(queueReplace(queueItems))
    dispatch(queueSetCurrent(newCurrentTrackIndex))
  }

  return (
    <>
      <Header>
        <QueueTitle>Queue</QueueTitle>
        <NowPlayingQueueActions />
      </Header>
      <NowPlayingQueueHeader />
      {items.length > 0 && (
        <NowPlayingQueueList
          items={itemsForDisplay}
          itemHeight={parseInt(theme.itemHeight, 0)}
          current={current}
          onQueueUpdate={handleUpdateQueue}
        />
      )}
      <QueueItemContextMenu />
    </>
  )
}

export default withTheme(NowPlayingQueue)

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
const QueueTitle = styled.h2`
  display: inline;
`
