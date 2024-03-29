import { useEffect, useState } from 'react'
import styled from 'styled-components'
import AlbumTeaser from 'modules/dashboard/components/AlbumTeaser'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { useTranslation } from 'react-i18next'
import ActionButtonIcon from '../../../common/components/ActionButtonIcon'
import { getRandomAlbums } from '../store'
import AlbumMoreActionsContextMenu from './AlbumMoreActionsContextMenu'

function RandomAlbums() {
  const { t } = useTranslation()

  const randomAlbums = useAppSelector((state) => state.dashboard.randomAlbums)
  const dispatch = useAppDispatch()
  const [selectedAlbum, setSelectedAlbum] = useState<string | undefined>(
    undefined
  )

  useEffect(() => {
    if (randomAlbums.length === 0) {
      dispatch(getRandomAlbums())
    }
  }, [dispatch, randomAlbums.length])

  return (
    <Wrapper>
      <Header>
        <h2>{t('dashboard.randomAlbums')}</h2>
        <ActionButtonIcon
          icon="refresh"
          onClick={() => dispatch(getRandomAlbums())}
          testId="random-albums-refresh-button"
        />
      </Header>
      {randomAlbums.length === 0 && (
        <EmptyState>
          <p>
            {t('dashboard.noAlbumsFound')}{' '}
            <TextLink to="/settings">{t('dashboard.scanLibrary')}</TextLink>
          </p>
        </EmptyState>
      )}
      {randomAlbums.length > 0 && (
        <AlbumsList>
          {randomAlbums.map((album: Album) => (
            <Cell key={album.id}>
              <AlbumTeaser
                album={album}
                selected={selectedAlbum === album.id}
                setSelected={setSelectedAlbum}
              />
            </Cell>
          ))}
        </AlbumsList>
      )}
      <AlbumMoreActionsContextMenu
        menuId="random-album-more-actions-context-menu"
        onHidden={() => setSelectedAlbum(undefined)}
      />
    </Wrapper>
  )
}

export default RandomAlbums

const Wrapper = styled.div`
  max-width: 1060px;
  min-width: 780px;
  margin: 0 auto 30px;
`
const Header = styled.div`
  height: ${(props) => props.theme.itemHeight};
  padding: 0 5px 0 20px;
  display: flex;
  align-items: center;
`
const AlbumsList = styled.div`
  padding: 0 10px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  align-items: flex-start;
`
const Cell = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px 10px;
`
const EmptyState = styled.div`
  padding: 5px 20px;
  color: ${(props) => props.theme.textSecondaryColor};
`
const TextLink = styled(Link)`
  color: ${(props) => props.theme.highlightFocus};
  text-decoration: none;

  :hover {
    text-decoration: underline;
  }
`
