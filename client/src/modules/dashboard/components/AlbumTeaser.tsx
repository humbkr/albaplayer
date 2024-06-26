import React, { useState } from 'react'
import styled from 'styled-components'
import { contextMenu } from 'react-contexify'
import { useAppDispatch } from 'store/hooks'
import { playAlbum } from 'modules/player/store/store'
import { useTranslation } from 'react-i18next'
import ActionButtonCircle from 'common/components/buttons/ActionButtonCircle'
import Cover from '../../../common/components/Cover'
import SearchLink from '../../browser/components/SearchLink'

type Props = {
  album: Album
  selected: boolean
  setSelected: (albumId: string) => void
}

function AlbumTeaser({ album, selected, setSelected }: Props) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const [mouseHover, setMouseHover] = useState(false)

  const handleMoreActionsPress = (
    e: React.MouseEvent,
    displayAllActions: boolean = false
  ) => {
    e.preventDefault()
    setSelected(album.id)
    contextMenu.show({
      id: 'random-album-more-actions-context-menu',
      event: e,
      props: {
        album,
        displayAllActions,
      },
    })
  }

  return (
    <Wrapper>
      <CoverWrapper
        onMouseOver={() => setMouseHover(true)}
        onMouseOut={() => setMouseHover(false)}
        onFocus={() => setMouseHover(true)}
        onBlur={() => setMouseHover(false)}
        onContextMenu={(e) => handleMoreActionsPress(e, true)}
        data-testid="album-teaser"
      >
        <Cover src={album.cover} />
        <Overlay
          visible={mouseHover || selected}
          data-testid="album-teaser-overlay"
        >
          <Actions>
            <ActionButtonCircle
              icon="play_arrow"
              size={36}
              onClick={() => dispatch(playAlbum(album.id))}
              testId="album-teaser-play-button"
            />
            <SecondaryActions visible={mouseHover || selected}>
              <ActionButtonCircle
                icon="more_horiz"
                size={36}
                onClick={handleMoreActionsPress}
                testId="album-teaser-more-button"
              />
            </SecondaryActions>
          </Actions>
        </Overlay>
      </CoverWrapper>
      <Info>
        <Title>{album.title}</Title>
        <Artist>
          <SearchLink
            type="artist"
            searchString={album.artist?.name || t('library.unknownArtist')}
          />
        </Artist>
      </Info>
    </Wrapper>
  )
}

export default AlbumTeaser

const Wrapper = styled.div`
  width: 100%;
`
const CoverWrapper = styled.div`
  position: relative;
  width: 100%;
  height: auto;
`
const Overlay = styled.div<{ visible: boolean }>`
  position: absolute;
  background-color: ${(props) =>
    props.visible ? 'rgba(25,25,34,.3)' : 'transparent'};
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: background-color linear 0.15s;
  z-index: 10;
`
const Actions = styled.div`
  position: absolute;
  display: flex;
  bottom: 10px;
  left: 10px;
  height: 37px;
  gap: 10px;
`
const SecondaryActions = styled.div<{ visible: boolean }>`
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transition: opacity linear 0.15s;
`
const Info = styled.div`
  padding: 10px 5px;
`
const Title = styled.h2`
  font-size: 1em;
`
const Artist = styled.div`
  font-size: 0.8em;
  margin-top: 5px;
  color: ${(props) => props.theme.colors.textSecondary};
`
