import { useState } from 'react'
import styled from 'styled-components'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import PlaylistCareListItem from 'modules/playlist/components/PlaylistCareListItem'
import VirtualList from 'common/components/virtualLists/VirtualList'
import Icon from 'common/components/Icon'
import ActionButton from 'common/components/ActionButton'
import Loading from 'common/components/Loading'
import { LibraryStateType } from 'modules/library/store'
import { useTranslation } from 'react-i18next'
import { findSimilarTracks } from '../utils/playlistCare'
import { PlaylistPane, playlistUpdateItems, playlistChangePane } from '../store'

function PlaylistsCarePane() {
  const { t } = useTranslation()

  const library: LibraryStateType = useAppSelector((state) => state.library)
  const playlist: Playlist = useAppSelector(
    (state) => state.playlist.currentPlaylist.playlist
  )
  const dispatch = useAppDispatch()

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
          <Strong>{t('playlists.care.experimental')}:</Strong>{' '}
          {t('playlists.care.description')}
        </Description>
        <ActionsWrapper>
          <Actions>
            <ActionButton raised onClick={processTracks} disabled={processing}>
              {t('playlists.care.start')}
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
          <VirtualList
            items={items}
            itemDisplay={PlaylistCareListItem}
            currentPosition={0}
            onItemClick={() => null}
            onKeyDown={() => null}
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
