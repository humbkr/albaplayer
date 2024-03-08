import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import Icon from '../../../common/components/Icon'

type Props = {
  item: PlaylistCareItem
  selected?: boolean
}

function PlaylistCareListItem({ item, selected = false }: Props) {
  const { t } = useTranslation()
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
            {t('playlists.care.notFound')}
            <Icon>close</Icon>
          </NotFound>
        )}
        {item.processed && item.similarTracks.length === 1 && (
          <Found>
            {t('playlists.care.found')}
            <Icon>done</Icon>
          </Found>
        )}
      </Result>
    </TrackWrapper>
  )
}

export default PlaylistCareListItem

const TrackWrapper = styled.div`
  display: grid;
  grid-template-columns: 60px auto auto 44px;
  height: ${(props) => props.theme.layout.itemHeight};
  border-bottom: 1px solid ${(props) => props.theme.colors.separator};

  > * {
    align-self: center;
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
const Result = styled.div`
  color: ${(props) => props.theme.colors.elementHighlightFocus};
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
  color: ${(props) => props.theme.colors.elementHighlightFocus};
`
const NotFound = styled.div`
  color: ${(props) => props.theme.colors.error};
`
