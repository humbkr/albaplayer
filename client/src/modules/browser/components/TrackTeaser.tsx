import React from 'react'
import styled from 'styled-components'
import { contextMenu } from 'react-contexify'
import { useAppSelector } from 'store/hooks'
import { useAddTrack, usePlayTrack } from 'modules/browser/services'
import { notify } from 'common/utils/notifications'
import { useTranslation } from 'react-i18next'

type Props = {
  item: Track
  index: number
  selected?: boolean
  onContextMenu: (itemId: string, index: number) => void
}

function TrackTeaser({ item, index, selected, onContextMenu }: Props) {
  const { onClickBehavior } = useAppSelector((state) => state.settings.browser)

  const { t } = useTranslation()

  const playTrack = usePlayTrack()
  const addTrack = useAddTrack()

  const onDoubleClick = () => {
    switch (onClickBehavior) {
      case 'play':
        playTrack(item.id)
        break
      case 'add':
        addTrack(item.id)
        notify(
          t('browser.tracks.addedToQueue', { itemName: item.title }),
          'info'
        )
        break
      default:
        // Do nothing.
        break
    }
  }

  const onRightClick = (e: React.MouseEvent) => {
    e.preventDefault()
    onContextMenu(item.id, index)
    contextMenu.show({
      id: 'track-context-menu',
      event: e,
      props: {
        data: item,
      },
    })
  }

  return (
    <TrackWrapper onContextMenu={onRightClick} onDoubleClick={onDoubleClick}>
      <TrackTeaserNumber className={selected ? 'selected' : ''}>
        {item.number}
      </TrackTeaserNumber>
      <TrackTeaserName>{item.title}</TrackTeaserName>
    </TrackWrapper>
  )
}

export default TrackTeaser

const TrackTeaserNumber = styled.div`
  display: table-cell;
  width: 40px;
  text-align: center;
  vertical-align: middle;
  font-size: 0.8em;
  color: ${(props) => props.theme.colors.textSecondary};
`
const TrackTeaserName = styled.h2`
  display: table-cell;
  font-size: 1em;
  font-weight: normal;
  vertical-align: middle;
`
const TrackWrapper = styled.div`
  display: table;
  width: 100%;
  height: ${(props) => props.theme.layout.itemHeight};
  padding: 0 15px 0 0;
  cursor: pointer;
  user-select: none;
`
