import { useAppDispatch, useAppSelector } from 'store/hooks'
import {
  getAlbumsList,
  libraryBrowserSortAlbums,
  selectAlbum,
} from 'modules/browser/store'
import type React from 'react'
import { addAlbum, playAlbum } from 'modules/player/store/store'
import { useTranslation } from 'react-i18next'

export function useAlbumsPanel() {
  const { t } = useTranslation()

  const albums = useAppSelector((state) => getAlbumsList(state))

  const orderBy = useAppSelector((state) => state.libraryBrowser.sortAlbums)
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
      libraryBrowserSortAlbums(event.currentTarget.value as AlbumsSortOptions)
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
