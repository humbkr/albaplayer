import React, { useEffect } from 'react'
import NowPlayingQueueItem from 'modules/now_playing/components/NowPlayingQueueItem'
import { Virtuoso } from 'react-virtuoso'
import {
  DraggableProvided,
  DragDropContext,
  DropResult,
  Droppable,
  Draggable,
} from '@hello-pangea/dnd'
import styled from 'styled-components'
import { arrayMoveImmutable } from 'common/utils/utils'

type ItemProps = {
  provided: DraggableProvided
  item: QueueItemDisplay
  isDragging: boolean
}

type Props = {
  items: QueueItemDisplay[]
  itemHeight: number
  onQueueUpdate: (
    newQueue: QueueItemDisplay[],
    newCurrentTrackIndex: number
  ) => void
  current: number
  contentElement?: HTMLDivElement
}

const DraggableItem = styled.div<{ isDragging: boolean }>`
  ${(props) =>
    props.isDragging
      ? `background-color: ${props.theme.colors.elementHighlight}`
      : ''};
`

function NowPlayingQueueList({
  items,
  onQueueUpdate,
  current,
  itemHeight,
  contentElement,
}: Props) {
  useEffect(() => {
    // Virtuoso's resize observer can throw this error,
    // which is caught by DnD and aborts dragging.
    window.addEventListener('error', (e) => {
      if (
        e.message ===
          'ResizeObserver loop completed with undelivered notifications.' ||
        e.message === 'ResizeObserver loop limit exceeded'
      ) {
        e.stopImmediatePropagation()
      }
    })

    // TODO: remove event listener at unmount.
  }, [])

  const onDragEnd = React.useCallback(
    (result: DropResult) => {
      if (
        !result.destination ||
        result.source.index === result.destination.index
      ) {
        return
      }

      const oldIndex = result.source.index
      const newIndex = result.destination.index

      let newCurrent = current
      if (oldIndex < current && newIndex >= current) {
        newCurrent--
      } else if (oldIndex > current && newIndex <= current) {
        newCurrent++
      } else if (oldIndex === current) {
        newCurrent = newIndex
      }

      onQueueUpdate(arrayMoveImmutable(items, oldIndex, newIndex), newCurrent)
    },
    [current, items, onQueueUpdate]
  )

  const Item = React.useMemo(
    () =>
      function ({ provided, item, isDragging }: ItemProps) {
        return (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            style={{ ...provided.draggableProps.style }}
          >
            <DraggableItem isDragging={isDragging}>
              <NowPlayingQueueItem item={item} currentIndex={current} />
            </DraggableItem>
          </div>
        )
      },
    [current]
  )

  const HeightPreservingItem = React.useMemo(
    () =>
      // @ts-ignore
      function ({ children, ...props }) {
        return (
          <div {...props} style={{ height: `${itemHeight}px` }}>
            {children}
          </div>
        )
      },
    [itemHeight]
  )

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable
        droppableId="droppable"
        mode="virtual"
        renderClone={(provided, snapshot, rubric) => (
          <Item
            provided={provided}
            isDragging={snapshot.isDragging}
            item={items[rubric.source.index]}
          />
        )}
      >
        {(provided) => (
          <div ref={provided.innerRef}>
            <Virtuoso
              style={{ height: '100%' }}
              useWindowScroll
              customScrollParent={contentElement}
              components={{
                // @ts-ignore
                Item: HeightPreservingItem,
              }}
              fixedItemHeight={itemHeight}
              data={items}
              itemContent={(index, item) => (
                <Draggable
                  draggableId={item.track.id}
                  index={index}
                  key={item.track.id}
                >
                  {(provided) => (
                    <Item provided={provided} item={item} isDragging={false} />
                  )}
                </Draggable>
              )}
            />
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default NowPlayingQueueList
