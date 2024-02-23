import React, { ComponentType, Ref } from 'react'
import styled, { useTheme } from 'styled-components'
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso'
import VirtualListItem from 'common/components/virtualLists/VirtualListItem'

type ItemDisplayProps = {
  item: any
  selected?: boolean
  index: number
  onContextMenu: (itemId: string, index: number) => void
}

type Props = {
  items: Array<any>
  itemDisplay: ComponentType<ItemDisplayProps>
  currentPosition: number
  onItemClick: (itemId: string, index: number) => void
  onKeyDown: (e: KeyboardEvent) => void
}

type InternalProps = Props & {
  forwardedRef: Ref<HTMLDivElement>
}

function VirtualList({
  items,
  itemDisplay,
  currentPosition,
  onItemClick,
  onKeyDown,
  forwardedRef,
}: InternalProps) {
  const theme = useTheme()

  const ref = React.useRef<VirtuosoHandle | null>(null)
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
        onKeyDown(e)
        return
      }

      if (nextIndex !== -1 && ref.current) {
        ref.current.scrollIntoView({
          index: nextIndex,
          behavior: 'auto',
          done: () => {
            onItemClick(items[nextIndex].id, nextIndex)
          },
        })
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
    <ListWrapper ref={forwardedRef}>
      <Virtuoso
        ref={ref}
        scrollerRef={scrollerRef}
        style={{ width: '100%' }}
        fixedItemHeight={parseInt(theme.layout.itemHeight, 10)}
        data={items}
        itemContent={(index, item) => {
          const selected = index === currentPosition

          return (
            <VirtualListItem
              className={selected ? 'selected' : ''}
              selected={selected}
              border
              key={item.id}
              onClick={() => onItemClick(item.id, index)}
            >
              <Display
                item={item}
                selected={selected}
                index={index}
                // Select item on context click.
                onContextMenu={() => onItemClick(item.id, index)}
              />
            </VirtualListItem>
          )
        }}
      />
    </ListWrapper>
  )
}

export default React.forwardRef<HTMLDivElement, Props>((props, ref) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <VirtualList {...props} forwardedRef={ref} />
))

const ListWrapper = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
`
