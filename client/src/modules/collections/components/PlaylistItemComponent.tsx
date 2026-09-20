import type React from 'react'
import { useState } from 'react'
import styled from 'styled-components'
import { contextMenu } from 'react-contexify'
import { useTranslation } from 'react-i18next'
import type { DraggableProvidedDragHandleProps } from '@hello-pangea/dnd'
import ActionButtonIcon from 'common/components/buttons/ActionButtonIcon'
import ActionsMenu from 'common/components/ActionsMenu'
import Icon from 'common/components/Icon'
import { notify } from 'common/utils/notifications'
import { useAppSelector } from 'store/hooks'
import { useAddTrack, usePlayTrack } from 'modules/browser/services'
import useLongPress from 'common/hooks/useLongPress'
import usePlaylistItemContextualActions from 'modules/collections/hooks/usePlaylistItemContextualActions'

type Props = {
  item: PlaylistItem
  selected?: boolean
  handleRemoveTrack: (position: number) => void
  onContextMenu: (p: { scrollToRow: number }) => void
  dragHandleProps?: DraggableProvidedDragHandleProps | null
}

function PlaylistItemComponent({
  item,
  handleRemoveTrack,
  onContextMenu,
  selected = false,
  dragHandleProps,
}: Props) {
  const { track, position } = item
  const { t } = useTranslation()
  const { onClickBehavior } = useAppSelector((state) => state.settings.browser)
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false)
  const actionItems = usePlaylistItemContextualActions()
  const handlers = useLongPress(() => {
    setIsActionsMenuOpen(true)
  })

  const playTrack = usePlayTrack()
  const addTrack = useAddTrack()

  const onDoubleClick = () => {
    switch (onClickBehavior) {
      case 'play':
        playTrack(track.id)
        break
      case 'add':
        addTrack(track.id)
        notify(
          t('notifications.addedToQueue', { itemName: track.title }),
          'info'
        )
        break
      default:
        break
    }
  }

  const onRightClick = (e: React.MouseEvent) => {
    e.preventDefault()
    onContextMenu({ scrollToRow: item.position - 1 })
    contextMenu.show({
      id: 'playlist-track-context-menu',
      event: e,
      props: {
        data: item,
      },
    })
  }

  return (
    <TrackWrapper
      onContextMenu={onRightClick}
      onDoubleClick={onDoubleClick}
      {...handlers()}
    >
      <DragHandle className={selected ? 'selected' : ''} {...dragHandleProps}>
        <Icon size={20}>drag_indicator</Icon>
      </DragHandle>
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
      <TrackActions className={selected ? 'selected' : ''}>
        <ActionButtonIcon
          icon="delete"
          onClick={() => handleRemoveTrack(position)}
        />
      </TrackActions>
      <ActionsMenu
        isOpen={isActionsMenuOpen}
        onClose={() => setIsActionsMenuOpen(false)}
        items={actionItems}
        data={item}
      />
    </TrackWrapper>
  )
}

export default PlaylistItemComponent

const TrackActions = styled.div`
  display: none;
  vertical-align: middle;
  text-align: right;
  color: ${(props) => props.theme.colors.textSecondary};

  &.selected button:hover {
    color: ${(props) => props.theme.colors.textPrimary};
  }
`
const DragHandle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  color: ${(props) => props.theme.colors.textSecondary};
  touch-action: none;

  &.selected {
    color: ${(props) => props.theme.colors.textPrimary};
  }

  &:active {
    cursor: grabbing;
  }
`
const TrackWrapper = styled.div`
  display: grid;
  grid-template-columns: 28px 60px auto 44px;
  height: ${(props) => props.theme.layout.itemHeight};
  color: ${(props) => props.theme.colors.textPrimary};
  cursor: pointer;

  > * {
    align-self: center;
  }

  &:hover {
    ${TrackActions} {
      display: block;
    }
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
