import React, { FunctionComponent } from 'react'
import styled from 'styled-components'
import { contextMenu } from 'react-contexify'

const AlbumTeaser: FunctionComponent<{
  item: Album
  selected?: boolean
  index: number
  onContextMenu: (p: { scrollToRow: number; itemId: string }) => void
}> = ({
  item, selected = false, index, onContextMenu,
}) => {
  const onRightClick = (e: React.MouseEvent) => {
    e.preventDefault()
    onContextMenu({ scrollToRow: index, itemId: item.id })
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
  color: ${(props) => props.theme.textSecondaryColor};
`
const AlbumTeaserArtist = styled.span`
  font-style: italic;
`
const AlbumTeaserWrapper = styled.div`
  display: table;
  width: 100%;
  height: ${(props) => props.theme.itemHeight};
  padding: 0 15px;
  overflow: hidden;
  white-space: nowrap;
  cursor: pointer;

  > div {
    display: table-cell;
    vertical-align: middle;
  }
`
