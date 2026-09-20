import type React from 'react'
import { useState } from 'react'
import styled from 'styled-components'
import dayjs from 'dayjs'
import { contextMenu } from 'react-contexify'
import { useAppDispatch } from 'store/hooks'
import { playAlbum } from 'modules/player/store/store'
import { useTranslation } from 'react-i18next'
import ActionButtonIcon from 'common/components/buttons/ActionButtonIcon'
import ActionsMenu from 'common/components/ActionsMenu'
import { isMobileBrowser } from 'common/utils/isMobileBrowser'
import useLongPress from 'common/hooks/useLongPress'
import useAlbumContextualActions from 'modules/browser/hooks/useAlbumContextualActions'
import Cover from '../../../common/components/Cover'
import SearchLink from '../../browser/components/SearchLink'

type Props = {
  album: Album
  selected: boolean
  setSelected: (albumId: string) => void
}

function AlbumTeaserHorizontal({ album, selected, setSelected }: Props) {
  const { t } = useTranslation()

  const dispatch = useAppDispatch()

  const [mouseHover, setMouseHover] = useState(false)
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false)

  const isTouchDevice = isMobileBrowser()
  const actionItems = useAlbumContextualActions()

  const handlers = useLongPress(() => {
    setIsActionsMenuOpen(true)
  })

  const handleMoreActionsPress = (e: React.MouseEvent) => {
    e.preventDefault()
    setSelected(album.id)
    contextMenu.show({
      id: 'recent-album-more-actions-context-menu',
      event: e,
      props: { data: album },
    })
  }

  const isVisible = mouseHover || selected || isTouchDevice

  return (
    <Wrapper
      onMouseOver={() => setMouseHover(true)}
      onMouseOut={() => setMouseHover(false)}
      onFocus={() => setMouseHover(true)}
      onBlur={() => setMouseHover(false)}
      onContextMenu={(e) => handleMoreActionsPress(e)}
      visible={isVisible}
      data-testid="album-teaser-horizontal"
      {...handlers()}
    >
      <CoverWrapper>
        <ActionOverlay
          visible={isVisible}
          data-testid="album-teaser-horizontal-overlay"
        >
          <ActionButton visible={isVisible}>
            <ActionButtonIcon
              icon="play_arrow"
              size={40}
              onClick={() => dispatch(playAlbum(album.id))}
              testId="album-teaser-horizontal-play-button"
            />
          </ActionButton>
        </ActionOverlay>
        <Cover src={album.cover} />
      </CoverWrapper>
      <Info>
        <Left>
          <MainInfo>
            <Title>{album.title}</Title>
            <Artist>
              <SearchLink
                type="artist"
                searchString={album.artist?.name || t('library.unknownArtist')}
              />
            </Artist>
          </MainInfo>
          <DateAdded>
            Added on: {dayjs.unix(album.dateAdded).format('DD/MM/YYYY')}
          </DateAdded>
        </Left>
        <SecondaryActions visible={isVisible}>
          <ActionButton visible={isVisible}>
            <ActionButtonIcon
              icon="more_horiz"
              size={25}
              onClick={handleMoreActionsPress}
              testId="album-teaser-horizontal-more-button"
            />
          </ActionButton>
        </SecondaryActions>
      </Info>
      <ActionsMenu
        isOpen={isActionsMenuOpen}
        onClose={() => setIsActionsMenuOpen(false)}
        items={actionItems}
        data={album}
      />
    </Wrapper>
  )
}

export default AlbumTeaserHorizontal

const Wrapper = styled.div<{ visible: boolean }>`
  display: flex;
  width: 100%;
  transition:
    background-color linear 0.15s,
    color linear 0.15s;
  border-radius: 3px;
  background-color: ${(props) =>
    props.visible ? props.theme.dashboard.backgroundColor : 'transparent'};
  color: ${(props) =>
    props.visible ? props.theme.dashboard.textPrimaryColor : 'inherit'};
`
const CoverWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  position: relative;
  width: 80px;
`
const ActionOverlay = styled.div<{ visible: boolean }>`
  position: absolute;
  background-color: ${(props) =>
    props.visible ? 'rgba(25,25,34,.3)' : 'transparent'};
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  color: ${(props) => props.theme.dashboard.textPrimaryColor};
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color linear 0.15s;
  z-index: 50;
`
const ActionButton = styled.div<{ visible: boolean }>`
  color: ${(props) =>
    props.visible ? props.theme.dashboard.textPrimaryColor : 'transparent'};
  transition: color linear 0.1s;

  i {
    text-shadow: ${(props) =>
      props.visible ? '0 0 10px rgba(0, 0, 0, 0.5)' : 'none'};
    transition: text-shadow linear 0.1s;
  }

  &:hover {
    color: ${(props) => props.theme.buttons.backgroundColorHover};
  }
`
const Info = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 5px 10px;
  width: 100%;
`
const Left = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`
const MainInfo = styled.div``
const Title = styled.h2`
  font-size: 1.1em;
  line-height: 1em;
`
const Artist = styled.div`
  margin-top: 5px;
  font-size: 0.9em;
`
const DateAdded = styled.div`
  font-size: 0.7em;
  color: ${(props) => props.theme.dashboard.textSecondaryColor};
`
const SecondaryActions = styled.div<{ visible: boolean }>`
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transition: opacity linear 0.15s;
  display: flex;
  align-items: center;
`
