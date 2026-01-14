import { useAppDispatch, useAppSelector } from 'store/hooks'
import { useGetAlbumDetails } from 'modules/browser/services'
import { useTranslation } from 'react-i18next'
import coverPlaceholder from 'common/assets/images/cover_placeholder.png'
import styled from 'styled-components'
import Cover from 'common/components/Cover'
import SearchLink from 'modules/browser/components/SearchLink'
import { addAlbum, playAlbum } from 'modules/player/store/store'
import type React from 'react'
import { contextMenu } from 'react-contexify'
import AlbumMoreActionsContextMenu from 'modules/dashboard/components/AlbumMoreActionsContextMenu'
import ActionButtonIcon from 'common/components/buttons/ActionButtonIcon'

export function AlbumDetailsHeader() {
  const { t } = useTranslation()

  const dispatch = useAppDispatch()
  const selectedAlbumId = useAppSelector(
    (state) => state.libraryBrowser.selectedAlbums
  )
  const album = useGetAlbumDetails(selectedAlbumId)

  if (!album) {
    return null
  }

  const handleMoreActionsPress = (
    e: React.MouseEvent,
    displayAllActions: boolean = false
  ) => {
    e.preventDefault()
    contextMenu.show({
      id: 'album-details-more-actions-context-menu',
      event: e,
      props: {
        album,
        displayAllActions,
      },
    })
  }

  return (
    <Container>
      <Artwork>
        <CoverWrapper>
          <Cover src={album.cover} />
        </CoverWrapper>
      </Artwork>
      <AlbumInfo>
        <AlbumTitle>{album.title ?? t('library.unknownAlbum')}</AlbumTitle>
        <AlbumYearAndArtist>
          <AlbumArtist>
            <SearchLink type="artist" searchString={album.artist?.name} />
          </AlbumArtist>
          {album.year && <div>{album.year}</div>}
        </AlbumYearAndArtist>
      </AlbumInfo>
      <Actions>
        <ActionButtonIcon
          icon="play_arrow"
          size={30}
          onClick={() => dispatch(playAlbum(album.id))}
          data-testid="album-teaser-play-button"
        />
        <ActionButtonIcon
          icon="playlist_add"
          size={30}
          onClick={() => dispatch(addAlbum(album.id))}
          data-testid="album-teaser-play-button"
        />
        <ActionButtonIcon
          icon="more_horiz"
          size={30}
          onClick={handleMoreActionsPress}
          data-testid="album-teaser-more-button"
        />
      </Actions>
      <AlbumMoreActionsContextMenu
        menuId="album-details-more-actions-context-menu"
        onHidden={() => null}
      />
    </Container>
  )
}

const Container = styled.div`
  margin-bottom: 20px;

  &:focus {
    background-color: #006666;
  }
`
const Artwork = styled.div`
  padding: 20px;
`
const CoverWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  background: url(${coverPlaceholder}) no-repeat;
  background-size: 100% 100%;
  overflow: hidden;
  user-select: none;
`
const AlbumInfo = styled.div`
  padding: 0 20px;
`
const AlbumTitle = styled.h2`
  margin-bottom: 10px;
`
const AlbumYearAndArtist = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
`
const AlbumArtist = styled.div`
  font-weight: 600;
`
const Actions = styled.div`
  margin-top: 15px;
  display: flex;
  gap: 5px;
  justify-content: center;
`
