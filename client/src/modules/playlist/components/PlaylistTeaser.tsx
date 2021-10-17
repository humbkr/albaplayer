import React, { FunctionComponent } from 'react'
import styled from 'styled-components'
import { contextMenu } from 'react-contexify'

const PlaylistTeaser: FunctionComponent<{
  playlist: Playlist
  index: number
  onContextMenu: (p: { scrollToRow: number }) => void
}> = ({ playlist, index, onContextMenu }) => {
  const onRightClick = (e: React.MouseEvent) => {
    e.preventDefault()
    onContextMenu({ scrollToRow: index })
    contextMenu.show({
      id: 'playlist-context-menu',
      event: e,
      props: {
        data: playlist,
      },
    })
  }

  return (
    <Wrapper onContextMenu={onRightClick}>
      <div>{playlist.title}</div>
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
