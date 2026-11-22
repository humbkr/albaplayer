import { useAppDispatch, useAppSelector } from 'store/hooks'
import { getAlbumsList, selectAlbum } from 'modules/browser/store'
import type React from 'react'
import { addAlbum, playAlbum } from 'modules/player/store/store'
import { useTranslation } from 'react-i18next'
import {
  selectUserConfig,
  updateBrowserConfig,
} from 'modules/settings/userConfig'

export function useAlbumsPanel() {
  const { t } = useTranslation()

  const orderBy = useAppSelector(
    (state) => selectUserConfig(state).browser.sortAlbums
  )
  const albums = useAppSelector((state) => getAlbumsList(state, orderBy))
  const currentAlbum = useAppSelector(
    (state) => state.libraryBrowser.selectedAlbums
  )
  const dispatch = useAppDispatch()

  const orderByOptions: { value: AlbumsSortOptions; label: string }[] = [
    { value: 'title', label: t('browser.albums.sort.title') },
    { value: 'year', label: t('browser.albums.sort.year') },
    { value: 'artistName', label: t('browser.albums.sort.artist') },
  ]

  // Change event handler for LibraryBrowserListHeader.
  const onSortChangeHandler = (event: React.MouseEvent<HTMLSelectElement>) => {
    dispatch(
      updateBrowserConfig({
        sortAlbums: event.currentTarget.value as AlbumsSortOptions,
      })
    )
  }

  const onItemClick = (itemId: string) => {
    dispatch(selectAlbum({ albumId: itemId }))
  }

  const handlePlayNow = (albumId: string) => {
    dispatch(playAlbum(albumId))
  }

  const handleAddToQueue = (albumId: string) => {
    dispatch(addAlbum(albumId))
  }

  return {
    albums,
    orderBy,
    currentAlbum,
    orderByOptions,
    onSortChangeHandler,
    onItemClick,
    handlePlayNow,
    handleAddToQueue,
  }
}
