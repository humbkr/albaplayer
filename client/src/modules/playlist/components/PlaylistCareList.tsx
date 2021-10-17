import React, { Ref } from 'react'
import styled, { withTheme } from 'styled-components'
import { AutoSizer, List } from 'react-virtualized'
import ListItem from 'modules/playlist/components/ListItem'
import { AppTheme } from 'themes/types'
import PlaylistCareListItem from './PlaylistCareListItem'

interface Props {
  items: PlaylistCareItem[]
  currentProcessedItem: number
}

interface InternalProps extends Props {
  theme: AppTheme
  forwardedRef: Ref<HTMLDivElement>
}

const PlaylistCareList = ({ items, forwardedRef, theme }: InternalProps) => {
  // Magic function used by react-virtualized.
  const rowRenderer = ({
    // eslint-disable-next-line no-shadow
    items,
    key,
    index,
    style,
  }: {
    items: PlaylistCareItem[]
    key: string
    index: number
    style: {}
  }) => (
    <ListItem selected={false} border key={key} style={style}>
      <PlaylistCareListItem
        item={items[index]}
        selected={false}
        handleRemoveTrack={() => null}
      />
    </ListItem>
  )

  return (
    // @ts-ignore
    <Wrapper>
      <AutoSizer>
        {({ height, width }) => (
          <List
            // @ts-ignore
            ref={forwardedRef}
            width={width}
            height={height}
            rowHeight={parseInt(theme.itemHeight, 0)}
            rowCount={items.length}
            rowRenderer={({ key, index, style }) => rowRenderer({
              items,
              key,
              index,
              style,
            })}
          />
        )}
      </AutoSizer>
    </Wrapper>
  )
}

const ThemedPlaylistCareList = withTheme(PlaylistCareList)

export default React.forwardRef<HTMLDivElement, Props>((props, ref) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <ThemedPlaylistCareList {...props} forwardedRef={ref} />
))

const Wrapper = styled.div`
  height: 100%;

  // Needed for the autosizer to work correctly.
  .autosizer-wrapper {
    overflow: auto;
    height: 100%;
  }
`
