import type React from 'react'
import { useState } from 'react'
import styled from 'styled-components'
import { contextMenu } from 'react-contexify'
import type { DraggableProvidedDragHandleProps } from '@hello-pangea/dnd'
import ActionButtonIcon from 'common/components/buttons/ActionButtonIcon'
import ActionsMenu from 'common/components/ActionsMenu'
import Icon from 'common/components/Icon'
import {
  playerTogglePlayPause,
  queueRemoveTrack,
  setItemFromQueue,
} from 'modules/player/store/store'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import AnimatedEQ from 'common/components/AnimatedEQ'
import { useTranslation } from 'react-i18next'
import { devices } from 'themes/breakpoints'
import useBreakpoints from 'common/utils/useLayoutBreakpoints'
import useLongPress from 'common/hooks/useLongPress'
import useQueueItemContextualActions from 'modules/now_playing/hooks/useQueueItemContextualActions'

type Props = {
  item: QueueItemDisplay
  currentIndex: number
  dragHandleProps?: DraggableProvidedDragHandleProps | null
}

function NowPlayingQueueItem({ item, currentIndex, dragHandleProps }: Props) {
  const { t } = useTranslation()
  const isPlaying = useAppSelector((state) => state.player.playing)
  const dispatch = useAppDispatch()
  const { isMD, isXL } = useBreakpoints()
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false)
  const actionItems = useQueueItemContextualActions()
  const handlers = useLongPress(() => {
    setIsActionsMenuOpen(true)
  })

  const handlePlayBackButton = () => {
    const isCurrent = currentIndex + 1 === item.position

    if (isCurrent && isPlaying) {
      // Pause playback.
      dispatch(playerTogglePlayPause(false))
    } else if (isCurrent) {
      // Resume playback.
      dispatch(playerTogglePlayPause(true))
    } else {
      dispatch(setItemFromQueue(item.position - 1))
      dispatch(playerTogglePlayPause(true))
    }
  }

  const handleRemoveTrack = () => {
    dispatch(queueRemoveTrack(item.position - 1))
  }

  const onRightClick = (e: React.MouseEvent) => {
    e.preventDefault()
    contextMenu.show({
      id: 'queue-item-context-menu',
      event: e,
      props: {
        data: item,
      },
    })
  }

  const isCurrent = currentIndex + 1 === item.position
  const playbackButtonIcon = isCurrent && isPlaying ? 'pause' : 'play_arrow'

  return (
    <QueueItemWrapper
      isCurrent={isCurrent}
      onContextMenu={onRightClick}
      {...handlers()}
    >
      <DragHandle {...dragHandleProps}>
        <Icon size={20}>drag_indicator</Icon>
      </DragHandle>
      <QueueItemFirstColumn>
        {(!isPlaying || !isCurrent) && (
          <QueueItemPosition>{item.position}</QueueItemPosition>
        )}
        {isPlaying && isCurrent && (
          <CurrentPlaying>
            <AnimatedEQ />
          </CurrentPlaying>
        )}
        <QueueActionButtonIcon>
          <ActionButtonIcon
            icon={playbackButtonIcon}
            onClick={handlePlayBackButton}
          />
        </QueueActionButtonIcon>
      </QueueItemFirstColumn>
      <QueueItemInfo highlightable isCurrent={isCurrent}>
        <Ellipsis>{item.track.title}</Ellipsis>
      </QueueItemInfo>
      {isMD && !isXL && (
        <QueueItemInfo>
          <div>
            <Ellipsis lineClamp={1}>{item.track.artist?.name}</Ellipsis>
          </div>
          <SecondaryInfo>
            <Ellipsis lineClamp={1}>
              {`${item.track.album?.title}${
                item.track.disc
                  ? `
               - ${t('player.queueItem.disc', { disc: item.track.disc })}`
                  : ''
              }`}
            </Ellipsis>
          </SecondaryInfo>
        </QueueItemInfo>
      )}
      {isXL && (
        <>
          <QueueItemInfo>
            <Ellipsis>{item.track.artist?.name}</Ellipsis>
          </QueueItemInfo>
          <QueueItemInfo>
            <Ellipsis>
              {`${item.track.album?.title}${
                item.track.disc
                  ? ` 
              - ${t('player.queueItem.disc', { disc: item.track.disc })}`
                  : ''
              }`}
            </Ellipsis>
          </QueueItemInfo>
        </>
      )}
      <QueueItemActions>
        <ActionButtonIcon icon="delete" onClick={handleRemoveTrack} />
      </QueueItemActions>
      <ActionsMenu
        isOpen={isActionsMenuOpen}
        onClose={() => setIsActionsMenuOpen(false)}
        items={actionItems}
        data={item}
      />
    </QueueItemWrapper>
  )
}

export default NowPlayingQueueItem

const QueueActionButtonIcon = styled.div`
  display: none;
  color: ${(props) => props.theme.buttons.backgroundColor};

  &:hover {
    color: ${(props) => props.theme.buttons.backgroundColorHover};
  }
`
const QueueItemActions = styled.div`
  display: none;
  vertical-align: middle;
  text-align: right;
  color: ${(props) => props.theme.colors.textSecondary};

  &:hover {
    color: ${(props) => props.theme.colors.textPrimary};
  }
`
const QueueItemPosition = styled.div``
const CurrentPlaying = styled.div``
const DragHandle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  color: ${(props) => props.theme.colors.textSecondary};
  touch-action: none;

  &:active {
    cursor: grabbing;
  }
`
const QueueItemWrapper = styled.div<{ isCurrent: boolean }>`
  display: grid;
  grid-template-columns: 28px 50px 50% auto 44px;
  height: ${(props) => props.theme.layout.itemHeight};
  color: ${(props) => props.theme.colors.textPrimary};
  border-bottom: 1px solid ${(props) => props.theme.colors.separator};
  ${(props) => (props.isCurrent ? 'font-weight: bold' : '')};
  padding-right: 5px;

  > * {
    align-self: center;
  }

  &:hover {
    background-color: ${(props) => props.theme.colors.elementHighlight};

    ${QueueItemPosition},
    ${CurrentPlaying} {
      display: none;
    }

    ${QueueActionButtonIcon}, ${QueueItemActions} {
      display: block;
    }
  }

  @media only screen and ${devices.xl} {
    grid-template-columns: 28px 50px 30% 30% auto 44px;
  }
`
const QueueItemFirstColumn = styled.div`
  justify-self: center;
  color: ${(props) => props.theme.colors.textSecondary};
`
const QueueItemInfo = styled.div<{
  highlightable?: boolean
  isCurrent?: boolean
}>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: ${(props) => props.theme.layout.itemHeight};
  font-weight: normal;
  padding-right: 10px;
  ${(props) =>
    props.highlightable && props.isCurrent ? 'font-weight: bold' : ''};
`
const Ellipsis = styled.div<{ lineClamp?: number }>`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: ${(props) => props.lineClamp || 2};
  line-clamp: ${(props) => props.lineClamp || 2};
  -webkit-box-orient: vertical;
`
const SecondaryInfo = styled.div`
  color: ${(props) => props.theme.colors.textSecondary};
`
