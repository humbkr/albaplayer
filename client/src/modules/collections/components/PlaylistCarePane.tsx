import { useState } from 'react'
import styled from 'styled-components'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import PlaylistCareListItem from 'modules/collections/components/PlaylistCareListItem'
import VirtualList from 'common/components/virtualLists/VirtualList'
import Icon from 'common/components/Icon'
import ActionButton from 'common/components/buttons/ActionButton'
import { LibraryStateType } from 'modules/library/store'
import { useTranslation } from 'react-i18next'
import LoaderPulse from 'common/components/LoaderPulse'
import { PLAYLIST_PANE, playlistChangePane } from 'modules/collections/store'
import {
  useGetCurrentPlaylist,
  useUpdatePlaylistItems,
} from 'modules/collections/services/services'
import { findSimilarTracks } from '../utils/playlistCare'

function PlaylistsCarePane() {
  const { t } = useTranslation()

  const library: LibraryStateType = useAppSelector((state) => state.library)
  const playlist = useGetCurrentPlaylist()
  const playlistUpdateItems = useUpdatePlaylistItems()
  const dispatch = useAppDispatch()

  const [processing, setProcessing] = useState<boolean>(false)
  const [currentProcessedTrack, setCurrentProcessedTrack] = useState<number>(0)
  const [processed, setProcessed] = useState(false)
  const [items, setItems] = useState<PlaylistCareItem[]>(
    playlist?.items.map((item) => ({
      ...item,
      similarTracks: [],
      processed: false,
    })) || []
  )

  if (!playlist) {
    return null
  }

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

    playlistUpdateItems(fixedTracks, playlist.id)

    setItems(processedItems)
    setProcessing(false)
    setProcessed(true)
  }

  return (
    <Wrapper>
      <Header>
        <BackButton
          onClick={() => dispatch(playlistChangePane(PLAYLIST_PANE.detail))}
        >
          <BackButtonIcon size={40}>navigate_before</BackButtonIcon>
        </BackButton>
        <Info>
          <Title>{playlist.title}</Title>
          <Subtitle>
            {playlist.dateCreated} - {playlist.items.length} track(s)
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
            {processing && <LoaderPulse />}
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
  height: ${(props) => props.theme.layout.itemHeight};
  border-bottom: 1px solid ${(props) => props.theme.colors.separator};

  a {
    text-decoration: none;
    color: ${(props) => props.theme.colors.textPrimary};
  }
`
const BackButton = styled.button`
  border: 0;
  background-color: transparent;
`
const BackButtonIcon = styled(Icon)`
  height: ${(props) => props.theme.layout.itemHeight};
  width: ${(props) => props.theme.layout.itemHeight};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.textPrimary};

  :hover {
    cursor: pointer;
    color: ${(props) => props.theme.colors.elementHighlightFocus};
  }
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
  color: ${(props) => props.theme.colors.textSecondary};
`
const Main = styled.main`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`
const Description = styled.p`
  padding: 15px;
  color: ${(props) => props.theme.colors.textSecondary};
`
const Strong = styled.span`
  font-weight: bold;
  color: ${(props) => props.theme.colors.textPrimary};
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
  color: ${(props) => props.theme.colors.textSecondary};
`
const ListWrapper = styled.div`
  flex-grow: 1;
`
