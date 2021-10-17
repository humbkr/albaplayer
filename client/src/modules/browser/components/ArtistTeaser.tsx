import React, { FunctionComponent } from 'react'
import styled from 'styled-components'
import { contextMenu } from 'react-contexify'

const ArtistTeaser: FunctionComponent<{
  item: Artist
  index: number
  onContextMenu: (p: { scrollToRow: number; itemId: string }) => void
}> = ({ item, index, onContextMenu }) => {
  const onRightClick = (e: React.MouseEvent) => {
    e.preventDefault()
    onContextMenu({ scrollToRow: index, itemId: item.id })
    contextMenu.show({
      id: 'artist-context-menu',
      event: e,
      props: {
        data: item,
      },
    })
  }

  return (
    <ArtistTeaserWrapper onContextMenu={onRightClick}>
      <ArtistTeaserName>{item.name}</ArtistTeaserName>
    </ArtistTeaserWrapper>
  )
}

export default ArtistTeaser

const ArtistTeaserName = styled.h2`
  display: table-cell;
  vertical-align: middle;
  font-size: 1em;
  font-weight: normal;
`
const ArtistTeaserWrapper = styled.div`
  display: table;
  width: 100%;
  height: ${(props) => props.theme.itemHeight};
  padding: 0 15px;
  cursor: pointer;
`
