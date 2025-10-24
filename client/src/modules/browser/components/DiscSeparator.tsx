import type React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { contextMenu } from 'react-contexify'
import { notify } from 'common/utils/notifications'
import { useAppSelector } from 'store/hooks'
import { useAddAlbumDisc, usePlayAlbumDisc } from 'modules/browser/services'

type Props = {
  discNumber: number | string
  selected?: boolean
  index: number
  onContextMenu: (itemId: string, index: number) => void
}

export default function DiscSeparator({
  discNumber,
  selected,
  index,
  onContextMenu,
}: Props) {
  const { t } = useTranslation()
  const { onClickBehavior } = useAppSelector((state) => state.settings.browser)
  const selectedAlbumId = useAppSelector(
    (state) => state.libraryBrowser.selectedAlbums
  )

  const playAlbumDisc = usePlayAlbumDisc()
  const addAlbumDisc = useAddAlbumDisc()

  const onDoubleClick = () => {
    switch (onClickBehavior) {
      case 'play':
        playAlbumDisc(selectedAlbumId, discNumber.toString())
        break
      case 'add':
        addAlbumDisc(selectedAlbumId, discNumber.toString())
        notify(
          t('browser.tracks.discAddedToQueue', { itemName: discNumber }),
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
    onContextMenu(discNumber.toString(), index)
    contextMenu.show({
      id: 'disc-context-menu',
      event: e,
      props: {
        data: {
          albumId: selectedAlbumId,
          disc: discNumber.toString(),
        },
      },
    })
  }

  return (
    <Container
      selected={selected}
      onContextMenu={onRightClick}
      onDoubleClick={onDoubleClick}
    >
      {t('browser.album.disc', { disc: discNumber })}
    </Container>
  )
}

const Container = styled.div<{ selected?: boolean }>`
  height: ${(props) => props.theme.layout.itemHeight};
  margin-top: 25px;
  padding-left: 40px;
  font-weight: bold;
  display: flex;
  align-items: center;
`
