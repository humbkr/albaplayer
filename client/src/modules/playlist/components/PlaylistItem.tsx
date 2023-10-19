import React from 'react'
import styled from 'styled-components'
import { contextMenu } from 'react-contexify'
import ActionButtonIcon from 'common/components/buttons/ActionButtonIcon'

type Props = {
  item: PlaylistItem
  selected?: boolean
  handleRemoveTrack: (position: number) => void
  onContextMenu: (p: { scrollToRow: number }) => void
}

function PlaylistItem({
  item,
  handleRemoveTrack,
  onContextMenu,
  selected = false,
}: Props) {
  const { track, position } = item

  const onRightClick = (e: React.MouseEvent) => {
    e.preventDefault()
    onContextMenu({ scrollToRow: item.position - 1 })
    contextMenu.show({
      id: 'playlist-track-context-menu',
      event: e,
      props: {
        data: item,
      },
    })
  }

  return (
    <TrackWrapper onContextMenu={onRightClick}>
      <TrackFirstColumn className={selected ? 'selected' : ''}>
        <div>{position}</div>
      </TrackFirstColumn>
      <div>
        <div>{track.title}</div>
        <TrackInfo className={selected ? 'selected' : ''}>
          {track.artist?.name} -
          <AlbumInfo>
            {` ${track.album?.title}`}
            {track.album?.year && ` (${track.album?.year})`}
          </AlbumInfo>
        </TrackInfo>
      </div>
      <TrackActions className={selected ? 'selected' : ''}>
        <ActionButtonIcon
          icon="delete"
          onClick={() => handleRemoveTrack(position)}
        />
      </TrackActions>
    </TrackWrapper>
  )
}

export default PlaylistItem

const TrackActions = styled.div`
  display: none;
  vertical-align: middle;
  text-align: right;
  color: ${(props) => props.theme.colors.textSecondary};
`
const TrackWrapper = styled.div`
  display: grid;
  grid-template-columns: 60px auto 44px;
  height: ${(props) => props.theme.layout.itemHeight};
  border-bottom: 1px solid ${(props) => props.theme.colors.separator};
  color: ${(props) => props.theme.colors.textPrimary};
  cursor: pointer;

  > * {
    align-self: center;
  }

  :hover {
    ${TrackActions} {
      display: block;
    }
  }
`
const TrackFirstColumn = styled.div`
  justify-self: center;
  color: ${(props) => props.theme.colors.textSecondary};
`
const TrackInfo = styled.div`
  font-size: 0.8em;
  color: ${(props) => props.theme.colors.textSecondary};
`
const AlbumInfo = styled.span`
  font-style: italic;
`
