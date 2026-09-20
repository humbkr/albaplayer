import type React from 'react'
import { useState } from 'react'
import styled from 'styled-components'
import { contextMenu } from 'react-contexify'
import { useAppSelector } from 'store/hooks'
import { useAddAlbum, usePlayAlbum } from 'modules/browser/services'
import { notify } from 'common/utils/notifications'
import { useTranslation } from 'react-i18next'
import ActionsMenu from 'common/components/ActionsMenu'
import useLongPress from 'common/hooks/useLongPress'
import useAlbumContextualActions from 'modules/browser/hooks/useAlbumContextualActions'

type Props = {
  item: Album
  selected?: boolean
  index: number
  onContextMenu: (itemId: string, index: number) => void
}

function AlbumTeaser({ item, selected = false, index, onContextMenu }: Props) {
  const { onClickBehavior } = useAppSelector((state) => state.settings.browser)

  const { t } = useTranslation()
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false)
  const actionItems = useAlbumContextualActions()
  const handlers = useLongPress(() => {
    setIsActionsMenuOpen(true)
  })

  const playAlbum = usePlayAlbum()
  const addAlbum = useAddAlbum()

  const onDoubleClick = () => {
    switch (onClickBehavior) {
      case 'play':
        playAlbum(item.id)
        break
      case 'add':
        addAlbum(item.id)
        notify(
          t('browser.albums.addedToQueue', { itemName: item.title }),
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
      id: 'album-context-menu',
      event: e,
      props: {
        data: item,
      },
    })
  }

  return (
    <AlbumTeaserWrapper
      onContextMenu={onRightClick}
      onDoubleClick={onDoubleClick}
      {...handlers()}
    >
      <div>
        <AlbumTeaserTitle>{item.title}</AlbumTeaserTitle>
        <AlbumSubInfo className={selected ? 'selected' : ''}>
          {item.year && <span>{item.year}</span>}
          {item.year && item.artist?.name && ' - '}
          <AlbumTeaserArtist>{item.artist?.name}</AlbumTeaserArtist>
        </AlbumSubInfo>
      </div>
      <ActionsMenu
        isOpen={isActionsMenuOpen}
        onClose={() => setIsActionsMenuOpen(false)}
        items={actionItems}
        data={item}
      />
    </AlbumTeaserWrapper>
  )
}

export default AlbumTeaser

const AlbumTeaserTitle = styled.h2`
  font-size: 1em;
  font-weight: normal;
  max-height: 18px;
`
const AlbumSubInfo = styled.div`
  font-size: 0.8em;
  margin-top: 5px;
  color: ${(props) => props.theme.colors.textSecondary};
  transition: color 0.15s ease-in-out;
`
const AlbumTeaserArtist = styled.span`
  font-style: italic;
`
const AlbumTeaserWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: ${(props) => props.theme.layout.itemHeight};
  padding: 0 15px;
  overflow: hidden;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
`
