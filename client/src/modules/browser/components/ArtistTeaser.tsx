import type React from 'react'
import { useState } from 'react'
import styled from 'styled-components'
import { contextMenu } from 'react-contexify'
import { useAppSelector } from 'store/hooks'
import { useAddArtist, usePlayArtist } from 'modules/browser/services'
import { notify } from 'common/utils/notifications'
import { useTranslation } from 'react-i18next'
import ActionsMenu from 'common/components/ActionsMenu'
import useLongPress from 'common/hooks/useLongPress'
import useArtistContextualActions from 'modules/browser/hooks/useArtistContextualActions'

type Props = {
  item: Artist
  index: number
  onContextMenu: (itemId: string, index: number) => void
}

function ArtistTeaser({ item, index, onContextMenu }: Props) {
  const { onClickBehavior } = useAppSelector((state) => state.settings.browser)

  const { t } = useTranslation()
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false)
  const actionItems = useArtistContextualActions()
  const handlers = useLongPress(() => {
    setIsActionsMenuOpen(true)
  })

  const playArtist = usePlayArtist()
  const addArtist = useAddArtist()

  const onDoubleClick = () => {
    switch (onClickBehavior) {
      case 'play':
        playArtist(item.id)
        break
      case 'add':
        addArtist(item.id)
        notify(
          t('browser.artists.addedToQueue', { itemName: item.name }),
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
      id: 'artist-context-menu',
      event: e,
      props: {
        data: item,
      },
    })
  }

  return (
    <ArtistTeaserWrapper
      onContextMenu={onRightClick}
      onDoubleClick={onDoubleClick}
      {...handlers()}
    >
      <ArtistTeaserName>{item.name}</ArtistTeaserName>
      <ActionsMenu
        isOpen={isActionsMenuOpen}
        onClose={() => setIsActionsMenuOpen(false)}
        items={actionItems}
        data={item}
      />
    </ArtistTeaserWrapper>
  )
}

export default ArtistTeaser

const ArtistTeaserName = styled.h2`
  display: table-cell;
  vertical-align: middle;
  font-size: 1em;
  font-weight: normal;
`
const ArtistTeaserWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: ${(props) => props.theme.layout.itemHeight};
  padding: 0 15px;
  cursor: pointer;
  user-select: none;
`
