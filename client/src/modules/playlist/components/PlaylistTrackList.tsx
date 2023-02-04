import React, { Ref, useEffect } from 'react'
import styled, { useTheme } from 'styled-components'
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso'
import VirtualListItem from 'common/components/virtualLists/VirtualListItem'
import PlaylistItemComponent from 'modules/playlist/components/PlaylistItem'
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  Droppable,
  DropResult,
} from '@hello-pangea/dnd'
import { arrayMoveImmutable } from 'common/utils/utils'

type ItemProps = {
  provided: DraggableProvided
  item: QueueItemDisplay
  index: number
  isDragging: boolean
}

type Props = {
  playlistId: string
  items: PlaylistItem[]
  currentPosition: number
  onItemClick: (itemId: string, index: number) => void
  onKeyDown: (e: KeyboardEvent) => void
  handleRemoveTrack: (trackIndex: number) => void
  onTrackListUpdate: (playlistId: string, newTrackList: PlaylistItem[]) => void
}

type InternalProps = Props & {
  forwardedRef: Ref<HTMLDivElement>
}

// Final list element.
function PlaylistTrackList({
  items,
  playlistId,
  currentPosition,
  onKeyDown,
  forwardedRef,
  handleRemoveTrack,
  onItemClick,
  onTrackListUpdate,
}: InternalProps) {
  const theme = useTheme()

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

      onTrackListUpdate(
        playlistId,
        arrayMoveImmutable(items, oldIndex, newIndex)
      )
      onItemClick(result.source.droppableId, newIndex)
    },
    [items, onItemClick, onTrackListUpdate, playlistId]
  )

  const ref = React.useRef<VirtuosoHandle | null>(null)

  const Item = React.useMemo(
    () =>
      function ({ provided, item, index, isDragging }: ItemProps) {
        const selected = index === currentPosition

        return (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            style={{ ...provided.draggableProps.style }}
          >
            <DraggableItem isDragging={isDragging}>
              <VirtualListItem
                className={selected ? 'selected' : ''}
                selected={selected}
                border
                key={item.track.id}
                onClick={() => onItemClick(item.track.id, index)}
              >
                <PlaylistItemComponent
                  item={item}
                  selected={selected}
                  // Select item on context click.
                  onContextMenu={() => onItemClick(item.track.id, index)}
                  handleRemoveTrack={handleRemoveTrack}
                />
              </VirtualListItem>
            </DraggableItem>
          </div>
        )
      },
    [currentPosition, handleRemoveTrack, onItemClick]
  )

  const HeightPreservingItem = React.useMemo(
    () =>
      // @ts-ignore
      function ({ children, ...props }) {
        return (
          <div {...props} style={{ height: theme.layout.itemHeight }}>
            {children}
          </div>
        )
      },
    [theme.layout.itemHeight]
  )

  const keyDownCallback = React.useCallback(
    (e: KeyboardEvent) => {
      let nextIndex = -1

      if (e.code === 'ArrowUp') {
        nextIndex = Math.max(0, currentPosition - 1)
      } else if (e.code === 'ArrowDown') {
        nextIndex = Math.min(items.length - 1, currentPosition + 1)
      } else {
        // Pass the event to the parent and abort.
        onKeyDown(e)
        return
      }

      if (nextIndex !== -1 && ref.current) {
        ref.current.scrollIntoView({
          index: nextIndex,
          behavior: 'auto',
          done: () => {
            onItemClick(items[nextIndex].track.id, nextIndex)
          },
        })
        e.preventDefault()
      }
    },
    [currentPosition, items, onItemClick, onKeyDown]
  )

  return (
    <Wrapper
      ref={forwardedRef}
      // Important: drag and drop won't work without this.
      style={{ overflow: 'auto' }}
      // @ts-ignore
      onKeyDown={keyDownCallback}
    >
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          droppableId="droppable"
          mode="virtual"
          renderClone={(provided, snapshot, rubric) => (
            <Item
              provided={provided}
              isDragging={snapshot.isDragging}
              item={items[rubric.source.index]}
              index={rubric.source.index}
            />
          )}
        >
          {(provided) => (
            <Virtuoso
              ref={ref}
              // @ts-ignore
              scrollerRef={provided.innerRef}
              style={{ width: '100%' }}
              fixedItemHeight={parseInt(theme.layout.itemHeight, 10)}
              data={items}
              components={{
                // @ts-ignore
                Item: HeightPreservingItem,
              }}
              itemContent={(index, item) => (
                <Draggable
                  draggableId={item.track.id}
                  index={index}
                  key={item.track.id}
                >
                  {(provided) => (
                    <Item
                      provided={provided}
                      item={item}
                      isDragging={false}
                      index={index}
                    />
                  )}
                </Draggable>
              )}
            />
          )}
        </Droppable>
      </DragDropContext>
    </Wrapper>
  )
}

export default React.forwardRef<HTMLDivElement, Props>((props, ref) => (
  <PlaylistTrackList {...props} forwardedRef={ref} />
))

const Wrapper = styled.div`
  display: flex;
  flex: 1;
`
const DraggableItem = styled.div<{ isDragging: boolean }>`
  ${(props) =>
    props.isDragging ? `background-color: ${props.theme.colors.elementHighlight}` : ''};
`
