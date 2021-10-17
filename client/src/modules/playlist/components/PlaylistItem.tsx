import React, { FunctionComponent } from 'react'
import styled from 'styled-components'
import { contextMenu } from 'react-contexify'
import ActionButtonIcon from 'common/components/ActionButtonIcon'

const PlaylistItem: FunctionComponent<{
  item: PlaylistItem
  selected: boolean
  handleRemoveTrack: (position: number) => void
  onContextMenu: (p: { scrollToRow: number }) => void
}> = ({
  item, handleRemoveTrack, onContextMenu, selected = false,
}) => {
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
  color: ${(props) => props.theme.textSecondaryColor};
`
const TrackWrapper = styled.div`
  display: grid;
  grid-template-columns: 60px auto 44px;
  height: ${(props) => props.theme.itemHeight};
  border-bottom: 1px solid ${(props) => props.theme.separatorColor};

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
  color: ${(props) => props.theme.textSecondaryColor};
`
const TrackInfo = styled.div`
  font-size: 0.8em;
  color: ${(props) => props.theme.textSecondaryColor};
`
const AlbumInfo = styled.span`
  font-style: italic;
`
