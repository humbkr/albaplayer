import React from 'react'
import styled from 'styled-components'
import Ripple from 'common/components/Ripple'
import coverPlaceholder from 'common/assets/images/cover_placeholder.png'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router'
import Cover from '../../../common/components/Cover'
import { search, setSearchFilter } from '../../browser/redux'
import SearchLink from '../../../common/components/SearchLink'

const TrackInfo: React.FC<{
  track: Track
  onClick: () => void
}> = ({ track, onClick }) => {
  const trackTitle = track?.title || 'Unknown title'
  const trackArtist = track?.artist?.name || 'Unknown artist'
  const trackCover = track?.cover || undefined

  const dispatch = useDispatch()
  const history = useHistory()

  const handleArtistSearch = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()

    dispatch(setSearchFilter('artist'))
    dispatch(search(trackArtist))
    history.push('/library')
  }

  return (
    <Ripple>
      <TrackInfoWrapper onClick={() => onClick()}>
        <Overlay />
        <Cover src={trackCover} />
        {track && (
          <OverlayText>
            <TrackTitle>{trackTitle}</TrackTitle>
            <ArtistName>
              by{' '}
              <SearchLink onClick={handleArtistSearch}>
                {trackArtist}
              </SearchLink>
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
  width: ${(props) => props.theme.sidebar.width};
  height: ${(props) => props.theme.sidebar.width};
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
