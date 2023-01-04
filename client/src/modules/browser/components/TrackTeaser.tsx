import React from 'react'
import styled from 'styled-components'
import { contextMenu } from 'react-contexify'

type Props = {
  item: Track
  index: number
  onContextMenu: (itemId: string, index: number) => void
}

function TrackTeaser({ item, index, onContextMenu }: Props) {
  const onRightClick = (e: React.MouseEvent) => {
    e.preventDefault()
    onContextMenu(item.id, index)
    contextMenu.show({
      id: 'track-context-menu',
      event: e,
      props: {
        data: item,
      },
    })
  }

  return (
    <TrackWrapper onContextMenu={onRightClick}>
      <TrackTeaserNumber>{item.number}</TrackTeaserNumber>
      <TrackTeaserName>{item.title}</TrackTeaserName>
    </TrackWrapper>
  )
}

export default TrackTeaser

const TrackTeaserNumber = styled.div`
  display: table-cell;
  width: 40px;
  text-align: center;
  vertical-align: middle;
  font-size: 0.8em;
`
const TrackTeaserName = styled.h2`
  display: table-cell;
  font-size: 1em;
  font-weight: normal;
  vertical-align: middle;
`
const TrackWrapper = styled.div`
  display: table;
  width: 100%;
  height: ${(props) => props.theme.itemHeight};
  padding: 0 15px 0 0;
  cursor: pointer;
`
