import styled from 'styled-components'
import TrackInfo from 'modules/player/components/TrackInfo'
import Controls from 'modules/player/components/Controls'
import ProgressBar from 'modules/player/components/ProgressBar'
import usePlayer from 'modules/player/hooks/usePlayer'

function Player() {
  const {
    queue,
    playing,
    progress,
    duration,
    volume,
    shuffle,
    repeat,
    track,
    handleTogglePlayPause,
    handleSetProgress,
    handleSetVolume,
    handleSetPreviousTrack,
    handleSetNextTrack,
    handleToggleRepeat,
    handleToggleShuffle,
  } = usePlayer()

  return (
    <PlayerWrapper>
      <TrackInfo track={track} onClick={handleTogglePlayPause} />
      <ProgressBar
        position={progress}
        duration={duration}
        seek={handleSetProgress}
      />
      <Controls
        playing={playing}
        shuffle={shuffle}
        repeat={repeat}
        volume={volume}
        setVolume={handleSetVolume}
        togglePlayPause={handleTogglePlayPause}
        toggleShuffle={handleToggleShuffle}
        toggleRepeat={handleToggleRepeat}
        skipToNext={handleSetNextTrack}
        skipToPrevious={handleSetPreviousTrack}
        hasPreviousTrack={!!queue.current}
        hasNextTrack={queue.current < queue.items.length - 1}
        hasTrack={!!track}
      />
    </PlayerWrapper>
  )
}

export default Player

const PlayerWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`
