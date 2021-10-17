import React, { FunctionComponent } from 'react'
import styled from 'styled-components'
import ActionButtonIcon from 'common/components/ActionButtonIcon'
import Icon from '../../../common/components/Icon'

const PlaylistCareListItem: FunctionComponent<{
  item: PlaylistCareItem
  selected: boolean
  handleRemoveTrack: (position: number) => void
}> = ({ item, handleRemoveTrack, selected = false }) => {
  const { track, position } = item

  return (
    <TrackWrapper>
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
      <Result>
        {item.processed && item.similarTracks.length !== 1 && (
          <NotFound>
            not found<Icon>close</Icon>
          </NotFound>
        )}
        {item.processed && item.similarTracks.length === 1 && (
          <Found>
            found<Icon>done</Icon>
          </Found>
        )}
      </Result>
      <TrackActions className={selected ? 'selected' : ''}>
        <ActionButtonIcon
          icon="delete"
          onClick={() => handleRemoveTrack(position)}
        />
      </TrackActions>
    </TrackWrapper>
  )
}

export default PlaylistCareListItem

const TrackActions = styled.div`
  display: none;
  vertical-align: middle;
  text-align: right;
  color: ${(props) => props.theme.textSecondaryColor};
`
const TrackWrapper = styled.div`
  display: grid;
  grid-template-columns: 60px auto auto 44px;
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
const Result = styled.div`
  color: ${(props) => props.theme.highlightFocus};
  display: flex;
  align-items: center;
  justify-content: flex-end;

  > div {
    display: flex;
    align-items: center;

    ${Icon} {
      margin-left: 10px;
    }
  }
`
const Found = styled.div`
  color: ${(props) => props.theme.highlightFocus};
`
const NotFound = styled.div`
  color: ${(props) => props.theme.messages.error.color};
`
