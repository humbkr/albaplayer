import React from 'react'
import styled from 'styled-components'
import { contextMenu } from 'react-contexify'

type Props = {
  item: Artist
  index: number
  onContextMenu: (itemId: string, index: number) => void
}

function ArtistTeaser({ item, index, onContextMenu }: Props) {
  const onRightClick = (e: React.MouseEvent) => {
    e.preventDefault()
    onContextMenu(item.id, index)
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
  height: ${(props) => props.theme.layout.itemHeight};
  padding: 0 15px;
  cursor: pointer;
`
