import React from 'react'
import styled from 'styled-components'
import { contextMenu } from 'react-contexify'

type Props = {
  item: Album
  selected?: boolean
  index: number
  onContextMenu: (itemId: string, index: number) => void
}

function AlbumTeaser({ item, selected = false, index, onContextMenu }: Props) {
  const onRightClick = (e: React.MouseEvent) => {
    e.preventDefault()
    onContextMenu(item.id, index)
    contextMenu.show({
      id: 'album-context-menu',
      event: e,
      props: {
        data: item,
      },
    })
  }

  return (
    <AlbumTeaserWrapper onContextMenu={onRightClick}>
      <div>
        <AlbumTeaserTitle>{item.title}</AlbumTeaserTitle>
        <AlbumSubInfo className={selected ? 'selected' : ''}>
          {item.year && <span>{item.year}</span>}
          {item.year && item.artist?.name && ' - '}
          <AlbumTeaserArtist>{item.artist?.name}</AlbumTeaserArtist>
        </AlbumSubInfo>
      </div>
    </AlbumTeaserWrapper>
  )
}

export default AlbumTeaser

const AlbumTeaserTitle = styled.h2`
  font-size: 1em;
  font-weight: normal;
  max-height: 18px;
`
const AlbumSubInfo = styled.div`
  font-size: 0.8em;
  margin-top: 5px;
  color: ${(props) => props.theme.colors.textSecondary};
`
const AlbumTeaserArtist = styled.span`
  font-style: italic;
`
const AlbumTeaserWrapper = styled.div`
  display: table;
  width: 100%;
  height: ${(props) => props.theme.layout.itemHeight};
  padding: 0 15px;
  overflow: hidden;
  white-space: nowrap;
  cursor: pointer;

  > div {
    display: table-cell;
    vertical-align: middle;
  }
`
