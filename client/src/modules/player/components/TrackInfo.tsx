import styled from 'styled-components'
import Ripple from 'common/components/Ripple'
import coverPlaceholder from 'common/assets/images/cover_placeholder.png'
import { useTranslation } from 'react-i18next'
import Cover from '../../../common/components/Cover'
import SearchLink from '../../browser/components/SearchLink'

type Props = {
  track: Track
  onClick: () => void
}

function TrackInfo({ track, onClick }: Props) {
  const { t } = useTranslation()

  const trackTitle = track?.title || t('library.unknownTitle')
  const trackArtist = track?.artist?.name || t('library.unknownArtist')
  const trackCover = track?.cover || undefined

  return (
    <Ripple>
      <TrackInfoWrapper onClick={onClick} data-testid="player-track-info">
        <Overlay />
        <Cover src={trackCover} />
        {track && (
          <OverlayText>
            <TrackTitle>{trackTitle}</TrackTitle>
            <ArtistName>
              by <SearchLink type="artist" searchString={trackArtist} />
            </ArtistName>
          </OverlayText>
        )}
      </TrackInfoWrapper>
    </Ripple>
  )
}

export default TrackInfo

const TrackInfoWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  background: url(${coverPlaceholder}) no-repeat;
  background-size: 100% 100%;
  overflow: hidden;
  user-select: none;
`
const Overlay = styled.div`
  position: absolute;
  background-color: #191922;
  opacity: 0.65;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
`
const OverlayText = styled.div`
  position: absolute;
  top: 40px;
  left: 20px;
  z-index: 15;
`
const TrackTitle = styled.h1`
  font-size: 1.5em;
  letter-spacing: 1px;
  color: #fff;
`
const ArtistName = styled.h2`
  margin-top: 10px;
  font-size: 1.2em;
  letter-spacing: 1px;
  font-weight: normal;
  color: #fff;
`
