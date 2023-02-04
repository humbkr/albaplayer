import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

function NowPlayingQueueHeader() {
  const { t } = useTranslation()

  return (
    <QueueHeaderRow>
      <TrackPosition>#</TrackPosition>
      <div>{t('player.queueHeader.track')}</div>
      <div>{t('player.queueHeader.artist')}</div>
    </QueueHeaderRow>
  )
}

export default NowPlayingQueueHeader

const QueueHeaderRow = styled.div`
  display: grid;
  grid-template-columns: 60px 40% auto;
  width: 100%;
  height: ${(props) => props.theme.layout.itemHeight};
  border-top: 1px solid ${(props) => props.theme.colors.separator};
  border-bottom: 1px solid ${(props) => props.theme.colors.separator};
  color: ${(props) => props.theme.colors.textSecondary};
  text-transform: uppercase;

  > div {
    align-self: center;
  }
`
const TrackPosition = styled.div`
  justify-self: center;
`
