import React, { Ref } from 'react'
import styled, { withTheme } from 'styled-components'
import { ArrowKeyStepper, AutoSizer, List } from 'react-virtualized'
import ListItem from 'modules/playlist/components/ListItem'
import { AppTheme } from 'themes/types'
import PlaylistTeaser from './PlaylistTeaser'

interface Props {
  items: Playlist[]
  currentPosition: number
  onItemClick: (playlist: Playlist, playlistIndex: number) => void
  onKeyDown: (e: React.KeyboardEvent) => void
}

interface InternalProps extends Props {
  theme: AppTheme
  forwardedRef: Ref<HTMLDivElement>
}

const PlaylistList = ({
  items,
  onKeyDown,
  onItemClick,
  currentPosition,
  forwardedRef,
  theme,
}: InternalProps) => {
  const selectRow = ({ scrollToRow }: { scrollToRow: number }) => {
    onItemClick(items[scrollToRow], scrollToRow)
  }

  // Magic function used by react-virtualized.
  const rowRenderer = ({
    // eslint-disable-next-line no-shadow
    items,
    scrollToRow,
    key,
    index,
    style,
  }: {
    items: Playlist[]
    scrollToRow: number
    key: string
    index: number
    style: {}
  }) => {
    const selected = index === scrollToRow

    return (
      <ListItem
        className={selected ? 'selected' : ''}
        selected={selected}
        border
        key={key}
        style={style}
        onClick={() => selectRow({ scrollToRow: index })}
      >
        <PlaylistTeaser
          playlist={items[index]}
          index={index}
          onContextMenu={selectRow}
        />
      </ListItem>
    )
  }

  return (
    // @ts-ignore
    <Wrapper onKeyDown={onKeyDown}>
      <ArrowKeyStepper
        // This class is used to manage the focused style in Playlists.jsx.
        className="autosizer-wrapper"
        columnCount={1}
        rowCount={items.length}
        mode="cells"
        isControlled
        onScrollToChange={selectRow}
        scrollToRow={currentPosition}
      >
        {({
          onSectionRendered,
          // eslint-disable-next-line no-shadow
          scrollToRow,
        }) => (
          <AutoSizer>
            {({ height, width }) => (
              <div ref={forwardedRef}>
                <List
                  // @ts-ignore
                  ref={forwardedRef}
                  width={width}
                  height={height}
                  rowHeight={parseInt(theme.itemHeight, 0)}
                  rowCount={items.length}
                  rowRenderer={({ key, index, style }) => rowRenderer({
                    items,
                    scrollToRow,
                    key,
                    index,
                    style,
                  })}
                  onRowsRendered={({ startIndex, stopIndex }) => {
                    // @ts-ignore
                    onSectionRendered({
                      rowStartIndex: startIndex,
                      rowStopIndex: stopIndex,
                    })
                  }}
                  scrollToIndex={scrollToRow}
                />
              </div>
            )}
          </AutoSizer>
        )}
      </ArrowKeyStepper>
    </Wrapper>
  )
}

const ThemedPlaylistList = withTheme(PlaylistList)

export default React.forwardRef<HTMLDivElement, Props>((props, ref) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <ThemedPlaylistList {...props} forwardedRef={ref} />
))

const Wrapper = styled.div`
  flex: 1;

  // Needed for the autosizer to work correctly.
  .autosizer-wrapper {
    overflow: auto;
    height: 100%;
  }
`
