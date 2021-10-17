import React, { FunctionComponent } from 'react'
import { AutoSizer, List, WindowScroller } from 'react-virtualized'
import {
  SortableContainer,
  SortableElement,
  arrayMove,
} from 'react-sortable-hoc'
import 'react-virtualized/styles.css'
import NowPlayingQueueItem from 'modules/now_playing/components/NowPlayingQueueItem'
import QueueItemDisplay from '../types/QueueItemDisplay'

// Make Queue item sortable.
const SortableItem = SortableElement(
  ({
    item,
    style,
    current,
  }: {
    item: QueueItemDisplay
    style: {}
    current: number
  }) => <NowPlayingQueueItem item={item} style={style} currentIndex={current} />
)

// List managed by react-virtualized.
const VirtualList: FunctionComponent<{
  current: number
  items: QueueItemDisplay[]
  rowHeight: number
  height: number
  width: number
  isScrolling: boolean
  onScroll: () => void
  scrollTop: number
}> = ({
  current,
  items,
  rowHeight,
  height,
  width,
  isScrolling,
  onScroll,
  scrollTop,
}) => {
  // Magic function used by react-virtualized.
  const rowRenderer = ({
    // eslint-disable-next-line no-shadow
    items,
    key,
    index,
    style,
  }: {
    items: QueueItemDisplay[]
    key: string
    index: number
    style: {}
  }) => (
    <SortableItem
      item={items[index]}
      index={index}
      key={key}
      style={style}
      current={current}
    />
  )

  return (
    <List
      autoHeight
      height={height}
      isScrolling={isScrolling}
      onScroll={onScroll}
      rowCount={items.length}
      rowHeight={rowHeight}
      rowRenderer={({ key, index, style }) => rowRenderer({
        items,
        key,
        index,
        style,
      })}
      scrollTop={scrollTop}
      width={width}
    />
  )
}

// Make list a sortable container.
const SortableList = SortableContainer(VirtualList)

// Final list element.
// eslint-disable-next-line react/no-multi-comp
const NowPlayingQueueList: FunctionComponent<{
  items: QueueItemDisplay[]
  itemHeight: number
  onQueueUpdate: (
    newQueue: QueueItemDisplay[],
    newCurrentTrackIndex: number
  ) => void
  current: number
}> = ({
  items, onQueueUpdate, current, itemHeight,
}) => {
  const onSortEnd = ({
    oldIndex,
    newIndex,
  }: {
    oldIndex: number
    newIndex: number
  }) => {
    if (oldIndex !== newIndex) {
      let newCurrent = current
      if (oldIndex < current && newIndex >= current) {
        newCurrent--
      } else if (oldIndex > current && newIndex <= current) {
        newCurrent++
      } else if (oldIndex === current) {
        newCurrent = newIndex
      }

      onQueueUpdate(arrayMove(items, oldIndex, newIndex), newCurrent)
    }
  }

  return (
    <WindowScroller>
      {({
        height, isScrolling, onChildScroll, scrollTop,
      }) => (
        <AutoSizer disableHeight>
          {({ width }) => (
            <SortableList
              current={current}
              items={items}
              width={width}
              height={height}
              rowHeight={itemHeight}
              isScrolling={isScrolling}
              // @ts-ignore
              onScroll={onChildScroll}
              scrollTop={scrollTop}
              onSortEnd={onSortEnd}
            />
          )}
        </AutoSizer>
      )}
    </WindowScroller>
  )
}

export default NowPlayingQueueList
