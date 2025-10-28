import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { devices } from 'themes/breakpoints'
import useBreakpoints from 'common/utils/useLayoutBreakpoints'

function NowPlayingQueueHeader() {
  const { t } = useTranslation()
  const { isMD, isXL } = useBreakpoints()

  if (!isMD) {
    return null
  }

  return (
    <QueueHeaderRow>
      <TrackPosition>#</TrackPosition>
      {isMD && !isXL && (
        <>
          <TrackInfo>{t('player.queueHeader.track')}</TrackInfo>
          <TrackInfo>
            {`${t('player.queueHeader.artist')} / ${t('player.queueHeader.album')}`}
          </TrackInfo>
        </>
      )}
      {isXL && (
        <>
          <TrackInfo>{t('player.queueHeader.track')}</TrackInfo>
          <TrackInfo>{t('player.queueHeader.artist')}</TrackInfo>
          <TrackInfo>{t('player.queueHeader.album')}</TrackInfo>
        </>
      )}
    </QueueHeaderRow>
  )
}

export default NowPlayingQueueHeader

const QueueHeaderRow = styled.div`
  display: grid;
  grid-template-columns: 50px 50% auto 44px;
  width: 100%;
  height: ${(props) => props.theme.layout.itemHeight};
  border-top: 1px solid ${(props) => props.theme.colors.separator};
  border-bottom: 1px solid ${(props) => props.theme.colors.separator};
  color: ${(props) => props.theme.colors.textSecondary};
  text-transform: uppercase;

  > div {
    display: flex;
    align-items: center;
  }

  @media only screen and ${devices.xl} {
    grid-template-columns: 50px 30% 30% auto 44px;
  }
`
const TrackPosition = styled.div`
  justify-content: center;
`
const TrackInfo = styled.div`
  padding-right: 10px;
`
