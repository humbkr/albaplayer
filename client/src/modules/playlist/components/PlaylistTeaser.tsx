import React from 'react'
import styled from 'styled-components'
import { contextMenu } from 'react-contexify'

type Props = {
  item: Playlist
  index: number
  onContextMenu: (itemId: string, index: number) => void
}

function PlaylistTeaser({ item, index, onContextMenu }: Props) {
  const onRightClick = (e: React.MouseEvent) => {
    e.preventDefault()
    onContextMenu(item.id, index)
    contextMenu.show({
      id: 'playlist-context-menu',
      event: e,
      props: {
        data: item,
      },
    })
  }

  return (
    <Wrapper onContextMenu={onRightClick}>
      <div>{item.title}</div>
    </Wrapper>
  )
}

export default PlaylistTeaser

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: ${(props) => props.theme.itemHeight};
  padding-left: 15px;
  cursor: pointer;
  border-bottom: 1px solid ${(props) => props.theme.separatorColor};
`
