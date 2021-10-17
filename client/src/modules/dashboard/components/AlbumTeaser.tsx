import React, { useState } from 'react'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import { contextMenu } from 'react-contexify'
import { playAlbum } from '../../player/redux'
import ActionButtonCircle from '../../../common/components/ActionButtonCircle'
import Cover from '../../../common/components/Cover'

const AlbumTeaser: React.FC<{
  album: Album
  selected: boolean
  setSelected: (albumId: string) => void
}> = ({ album, selected, setSelected }) => {
  const dispatch = useDispatch()

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
              backgroundColor="rgba(0,0,0,0.65)"
              onClick={() => dispatch(playAlbum(album.id))}
              testId="album-teaser-play-button"
            />
            <SecondaryActions visible={mouseHover || selected}>
              <ActionButtonCircle
                icon="more_horiz"
                size={36}
                backgroundColor="rgba(0,0,0,0.65)"
                onClick={handleMoreActionsPress}
                testId="album-teaser-more-button"
              />
            </SecondaryActions>
          </Actions>
        </Overlay>
      </CoverWrapper>
      <Info>
        <Title>{album.title}</Title>
        <Artist>{album.artist?.name || 'Unknown artist'}</Artist>
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
  background-color: ${(props) => (props.visible ? 'rgba(25,25,34,.3)' : 'transparent')};
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

  > * {
    margin-right: 10px;
  }
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
  color: ${(props) => props.theme.textSecondaryColor};
`
