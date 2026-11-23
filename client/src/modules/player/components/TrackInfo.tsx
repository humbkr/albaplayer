import styled from 'styled-components'
import coverPlaceholder from 'common/assets/images/cover_placeholder.png'
import { useTranslation } from 'react-i18next'
import Cover from '../../../common/components/Cover'
import SearchLink from '../../browser/components/SearchLink'
import PlaybackTime from './PlaybackTime'

type Props = {
  track: Track
  // Playback position in seconds.
  progress: number
  // Track duration in seconds.
  duration: number
  isProgressBarHovered?: boolean
  onClick: () => void
}

function TrackInfo({
  track,
  progress,
  duration,
  isProgressBarHovered = false,
  onClick,
}: Props) {
  const { t } = useTranslation()

  const trackTitle = track?.title || t('library.unknownTitle')
  const trackArtist = track?.artist?.name || t('library.unknownArtist')

  return (
    <TrackInfoWrapper onClick={onClick} data-testid="player-track-info">
      <Overlay />
      <Cover src={track?.cover} data-testid="track-art" />
      {track && (
        <OverlayText>
          <TrackTitle>{trackTitle}</TrackTitle>
          <ArtistName>
            by <SearchLink type="artist" searchString={trackArtist} />
          </ArtistName>
        </OverlayText>
      )}
      {track && (
        <PlaybackTime
          position={progress}
          duration={duration}
          isProgressBarHovered={isProgressBarHovered}
        />
      )}
    </TrackInfoWrapper>
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
  opacity: 0.6;
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
