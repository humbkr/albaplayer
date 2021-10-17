import React, { useState } from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../store/types'
import Icon from '../../../common/components/Icon'
import ActionButton from '../../../common/components/ActionButton'
import PlaylistCareList from './PlaylistCareList'
import { findSimilarTracks } from '../utils/playlistCare'
import { LibraryStateType } from '../../library/redux'
import Loading from '../../../common/components/Loading'
import { PlaylistPane, playlistUpdateItems, playlistChangePane } from '../redux'

const PlaylistsCarePane = () => {
  const library: LibraryStateType = useSelector(
    (state: RootState) => state.library
  )
  const playlist: Playlist = useSelector(
    (state: RootState) => state.playlist.currentPlaylist.playlist
  )
  const dispatch = useDispatch()

  const [items, setItems] = useState<PlaylistCareItem[]>(
    playlist.items.map((item) => ({
      ...item,
      similarTracks: [],
      processed: false,
    }))
  )
  const [processing, setProcessing] = useState<boolean>(false)
  const [currentProcessedTrack, setCurrentProcessedTrack] = useState<number>(0)
  const [processed, setProcessed] = useState(false)

  const processTracks = () => {
    setProcessing(true)
    const processedItems = items.map((item) => {
      setCurrentProcessedTrack(item.position)
      return {
        ...item,
        similarTracks: findSimilarTracks(item.track, library),
        processed: true,
      }
    })

    // Start replacing items right away. In a future version we will have to let the user
    // select the replacement track in case of multiple hits.
    const fixedTracks = processedItems.map((item) => {
      if (item.similarTracks.length === 1) {
        return { track: item.similarTracks[0], position: item.position }
      }

      return { track: item.track, position: item.position }
    })

    dispatch(
      playlistUpdateItems({
        playlistId: playlist.id,
        newItems: fixedTracks,
      })
    )

    setItems(processedItems)
    setProcessing(false)
    setProcessed(true)
  }

  return (
    <Wrapper>
      <Header>
        <BackButton
          onClick={() => dispatch(playlistChangePane(PlaylistPane.Detail))}
        >
          <BackButtonIcon size={40}>navigate_before</BackButtonIcon>
        </BackButton>
        <Info>
          <Title>{playlist.title}</Title>
          <Subtitle>
            {playlist.date} - {playlist.items.length} track(s)
          </Subtitle>
        </Info>
      </Header>
      <Main>
        <Description>
          <Strong>Experimental:</Strong> fix a playlist that has become
          desynchronised from the library, for example after having cleaned up
          the library an rebuilt it. This will try to find your tracks again and
          update the playlist.
        </Description>
        <ActionsWrapper>
          <Actions>
            <ActionButton raised onClick={processTracks} disabled={processing}>
              Start
            </ActionButton>
            {processing && <Loading />}
            {(processing || processed) && (
              <Counter>
                {currentProcessedTrack} / {items.length}
              </Counter>
            )}
          </Actions>
        </ActionsWrapper>
        <ListWrapper>
          <PlaylistCareList
            items={items}
            currentProcessedItem={currentProcessedTrack}
          />
        </ListWrapper>
      </Main>
    </Wrapper>
  )
}

export default PlaylistsCarePane

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  vertical-align: top;
  overflow: hidden;
  height: 100%;
`
const Header = styled.div`
  display: flex;
  align-items: center;
  height: ${(props) => props.theme.itemHeight};
  border-bottom: 1px solid ${(props) => props.theme.separatorColor};

  a {
    text-decoration: none;
    color: ${(props) => props.theme.textPrimaryColor};
  }
`
const BackButton = styled.button`
  border: 0;
  background-color: transparent;

  :hover {
    cursor: pointer;
  }
`
const BackButtonIcon = styled(Icon)`
  height: ${(props) => props.theme.itemHeight};
  width: ${(props) => props.theme.itemHeight};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.textPrimaryColor};
`
const Info = styled.div`
  display: inline-block;
`
const Title = styled.h1`
  font-size: 1.3em;
`
const Subtitle = styled.p`
  font-size: 0.8em;
  margin-top: 2px;
  font-weight: normal;
  color: ${(props) => props.theme.textSecondaryColor};
`
const Main = styled.main`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`
const Description = styled.p`
  padding: 15px;
  color: ${(props) => props.theme.textSecondaryColor};
`
const Strong = styled.span`
  font-weight: bold;
  color: ${(props) => props.theme.textPrimaryColor};
`
const ActionsWrapper = styled.div`
  padding: 5px 15px 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`
const Actions = styled.div`
  display: flex;
  align-items: center;

  > * {
    margin-right: 10px;
  }
`
const Counter = styled.div`
  color: ${(props) => props.theme.textSecondaryColor};
`
const ListWrapper = styled.div`
  flex-grow: 1;
`
