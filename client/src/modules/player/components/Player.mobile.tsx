import styled from 'styled-components'
import usePlayer from 'modules/player/hooks/usePlayer'
import { useTranslation } from 'react-i18next'
import ControlButton from 'modules/player/components/ControlButton'
import { PlayerPlaybackMode } from 'modules/player/utils'

import { FunctionComponent, SVGProps } from 'react'
import Cover from 'common/components/Cover'
import { ReactComponent as PlayIcon } from '../assets/play.svg'
import { ReactComponent as PauseIcon } from '../assets/pause.svg'
import { ReactComponent as NextIcon } from '../assets/next.svg'

function Player() {
  const { t } = useTranslation()
  const {
    queue,
    playing,
    repeat,
    track,
    handleTogglePlayPause,
    handleSetNextTrack,
  } = usePlayer()

  const onSkipToNext = async () => {
    await handleSetNextTrack(false)
  }

  let PlayPauseIcon: FunctionComponent<SVGProps<SVGSVGElement>>
  switch (playing) {
    case true:
      PlayPauseIcon = PauseIcon
      break
    case false:
    default:
      PlayPauseIcon = PlayIcon
  }

  const trackTitle = track?.title || t('library.unknownTitle')
  const trackArtist = track?.artist?.name || t('library.unknownArtist')

  const hasNextTrack = queue.current < queue.items.length - 1

  return (
    <MainContainer>
      <PlayerContainer>
        <Playing>
          <CoverContainer>
            <Cover src={track?.cover} />
          </CoverContainer>
          {track && (
            <TrackInfo>
              <TrackTitle>{trackTitle}</TrackTitle>
              <ArtistName>by {trackArtist}</ArtistName>
            </TrackInfo>
          )}
        </Playing>
        <Controls>
          <ControlButton
            onClick={() => handleTogglePlayPause()}
            size={25}
            disabled={!track}
            testId={'play-pause-button'}
          >
            <PlayPauseIcon />
          </ControlButton>
          <ControlButton
            onClick={onSkipToNext}
            size={25}
            disabled={
              !track ||
              (!hasNextTrack &&
                repeat !== PlayerPlaybackMode.PLAYER_REPEAT_LOOP_ALL)
            }
            testId={'next-button'}
          >
            <NextIcon />
          </ControlButton>
        </Controls>
      </PlayerContainer>
    </MainContainer>
  )
}

export default Player

const MainContainer = styled.div`
  width: 100%;
  height: 50px;
  padding: 5px;
`
const PlayerContainer = styled.div`
  background-color: ${(props) => props.theme.colors.background};
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  border-radius: 5px;
  overflow: hidden;
`
const Playing = styled.div`
  display: flex;
  flex-grow: 1;
  min-width: 0;
`
const CoverContainer = styled.div`
  position: relative;
  height: 50px;
  aspect-ratio: 1;
  overflow: hidden;
`
const TrackInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 10px;
  min-width: 0;
`
const TrackTitle = styled.h1`
  font-size: 1em;
  letter-spacing: 1px;
  color: ${(props) => props.theme.colors.textPrimary};
  line-height: 1em;
  width: 100%;

  overflow: hidden;
  min-width: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
`
const ArtistName = styled.h2`
  margin-top: 2px;
  font-size: 0.8em;
  letter-spacing: 1px;
  font-weight: normal;
  color: ${(props) => props.theme.colors.textPrimary};

  overflow: hidden;
  min-width: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
`
const Controls = styled.div`
  display: flex;
  height: 50px;

  > * {
    padding: 0 10px;
  }
`
