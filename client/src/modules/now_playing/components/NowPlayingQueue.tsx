import styled, { withTheme } from 'styled-components'
import { queueReplace, queueSetCurrent } from 'modules/player/store/store'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { useTranslation } from 'react-i18next'
import NowPlayingQueueHeader from './NowPlayingQueueHeader'
import NowPlayingQueueList from './NowPlayingQueueList'
import NowPlayingQueueActions from './NowPlayingQueueActions'
import QueueItemContextMenu from './QueueItemContextMenu'

type Props = {
  theme: AppTheme
}

function NowPlayingQueue({ theme }: Props) {
  const { t } = useTranslation()

  const { items, current } = useAppSelector((state) => state.queue)
  const dispatch = useAppDispatch()

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
        <QueueTitle>{t('player.queue')}</QueueTitle>
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
