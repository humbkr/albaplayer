import type { ComponentType, Ref } from 'react'
import React from 'react'
import styled, { useTheme } from 'styled-components'
import type { FlatScrollIntoViewLocation, VirtuosoHandle } from 'react-virtuoso'
import { Virtuoso } from 'react-virtuoso'
import VirtualListItem from 'common/components/virtualLists/VirtualListItem'

type ItemDisplayProps = {
  item: any
  selected?: boolean
  index: number
  onContextMenu: (itemId: string, index: number) => void
  type?: string
}

type Props = {
  items: Array<any>
  itemDisplay: ComponentType<ItemDisplayProps>
  currentPosition: number
  onItemClick: (itemId: string) => void
  onKeyDown?: (e: KeyboardEvent) => void
  Header?: React.ReactNode
  fixedItemHeight?: boolean
  ref: Ref<HTMLDivElement>
}

export default function VirtualList({
  items,
  itemDisplay,
  currentPosition,
  onItemClick,
  onKeyDown,
  Header,
  fixedItemHeight = true,
  ref,
}: Props) {
  const theme = useTheme()

  const virtuosoRef = React.useRef<VirtuosoHandle | null>(null)
  const listRef = React.useRef(null)

  const keyDownCallback = React.useCallback(
    (e: KeyboardEvent) => {
      let nextIndex = -1

      if (e.code === 'ArrowUp') {
        nextIndex = Math.max(0, currentPosition - 1)
      } else if (e.code === 'ArrowDown') {
        nextIndex = Math.min(items.length - 1, currentPosition + 1)
      } else {
        // Pass the event to the parent and abort.
        if (onKeyDown) {
          onKeyDown(e)
        }
        return
      }

      if (nextIndex !== -1 && virtuosoRef.current) {
        const scrollParameters: FlatScrollIntoViewLocation = {
          index: nextIndex,
          behavior: 'auto',
          done: () => {
            onItemClick(items[nextIndex].id)
          },
        }

        virtuosoRef.current.scrollIntoView(scrollParameters)
        e.preventDefault()
      }
    },
    [currentPosition, items, onItemClick, onKeyDown]
  )

  const scrollerRef = React.useCallback(
    (element: any) => {
      if (element) {
        element.addEventListener('keydown', keyDownCallback)
        listRef.current = element
      } else {
        // @ts-ignore
        listRef.current?.removeEventListener('keydown', keyDownCallback)
      }
    },
    [keyDownCallback]
  )

  const Display: ComponentType<ItemDisplayProps> = itemDisplay

  return (
    <ListWrapper ref={ref}>
      <Virtuoso
        ref={virtuosoRef}
        scrollerRef={scrollerRef}
        style={{ width: '100%' }}
        fixedItemHeight={
          fixedItemHeight ? parseInt(theme.layout.itemHeight, 10) : undefined
        }
        data={items}
        components={Header ? { Header: () => Header } : {}}
        itemContent={(index, item) => {
          const selected = index === currentPosition

          return (
            <VirtualListItem
              className={selected ? 'selected' : ''}
              selected={selected}
              border
              key={item.id}
              onClick={() => onItemClick(item.id)}
            >
              <Display
                item={item}
                selected={selected}
                index={index}
                // Select item on context click.
                onContextMenu={() => onItemClick(item.id)}
                type={item.type}
              />
            </VirtualListItem>
          )
        }}
      />
    </ListWrapper>
  )
}

const ListWrapper = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
`
