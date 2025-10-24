import { useEffect } from 'react'
import styled from 'styled-components'
import { libraryBrowserInit } from 'modules/browser/store'
import { useAppDispatch } from 'store/hooks'
import { useTranslation } from 'react-i18next'
import Icon from 'common/components/Icon'
import { NavLink } from 'react-router'
import ROUTES from 'routing'

/**
 * Library browser screen.
 */
export default function LibraryBrowser() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(libraryBrowserInit())
  }, [dispatch])

  return (
    <Container>
      <Category to={ROUTES.libraryBrowserArtists}>
        <CategoryLeft>
          <Icon>person</Icon>
          <h3>{t('browser.artists.title')}</h3>
        </CategoryLeft>
        <Icon>chevron_right</Icon>
      </Category>
      <Category to={ROUTES.libraryBrowserAlbums}>
        <CategoryLeft>
          <Icon>album</Icon>
          <h3>{t('browser.albums.title')}</h3>
        </CategoryLeft>
        <Icon>chevron_right</Icon>
      </Category>
      <Category to={ROUTES.libraryBrowserTracks}>
        <CategoryLeft>
          <Icon>audiotrack</Icon>
          <h3>{t('browser.tracks.title')}</h3>
        </CategoryLeft>
        <Icon>chevron_right</Icon>
      </Category>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
`
const Category = styled(NavLink)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: ${(props) => props.theme.layout.itemHeight};
  width: 100%;
  padding: 15px;
  color: ${(props) => props.theme.colors.textPrimary};
  text-decoration: none;
  border-bottom: 1px solid ${(props) => props.theme.colors.separator};
`
const CategoryLeft = styled.div`
  display: flex;
  gap: 10px;
`
