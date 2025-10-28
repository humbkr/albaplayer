import { useAppDispatch, useAppSelector } from 'store/hooks'
import {
  getTracksList,
  libraryBrowserSelectTrack,
  libraryBrowserSortTracks,
} from 'modules/browser/store'
import type React from 'react'
import { useTranslation } from 'react-i18next'
import {
  useAddAlbumDisc,
  useAddTrack,
  usePlayAlbumDisc,
  usePlayTrack,
} from 'modules/browser/services'

export function useTracksPanel() {
  const { t } = useTranslation()

  const selectedAlbumId = useAppSelector(
    (state) => state.libraryBrowser.selectedAlbums
  )
  const isInAlbumMode = selectedAlbumId !== '0'

  const tracks = useAppSelector((state) => getTracksList(state, isInAlbumMode))
  const orderBy = useAppSelector((state) => state.libraryBrowser.sortTracks)
  const currentItem = useAppSelector(
    (state) => state.libraryBrowser.selectedTracks
  )
  const dispatch = useAppDispatch()

  const playTrack = usePlayTrack()
  const addTrack = useAddTrack()
  const playAlbumDisc = usePlayAlbumDisc()
  const addAlbumDisc = useAddAlbumDisc()

  const orderByOptions: { value: TracksSortOptions; label: string }[] = [
    { value: 'title', label: t('browser.tracks.sort.title') },
    { value: 'number', label: t('browser.tracks.sort.number') },
    { value: 'album', label: t('browser.tracks.sort.album') },
    { value: 'artistId', label: t('browser.tracks.sort.artist') },
  ]

  // Change event handler for LibraryBrowserListHeader.
  const onSortChangeHandler = (event: React.MouseEvent<HTMLSelectElement>) => {
    dispatch(
      libraryBrowserSortTracks(event.currentTarget.value as TracksSortOptions)
    )
  }

  const onItemClick = (itemId: string) => {
    dispatch(libraryBrowserSelectTrack({ trackId: itemId }))
  }

  const handlePlayNow = (itemId: string) => {
    if (isInAlbumMode && itemId.startsWith('disc=')) {
      const discNumber = itemId.split('=')[1]
      playAlbumDisc(selectedAlbumId, discNumber)
    } else {
      playTrack(itemId)
    }
  }

  const handleAddToQueue = (itemId: string) => {
    if (isInAlbumMode && itemId.startsWith('disc=')) {
      const discNumber = itemId.split('=')[1]
      addAlbumDisc(selectedAlbumId, discNumber)
    } else {
      addTrack(itemId)
    }
  }

  // Handle multiple discs albums.
  let items = []

  const hasMultipleDiscs =
    tracks.some(
      (track, index) => track.disc && tracks[index - 1]?.disc !== track.disc
    ) || false

  if (isInAlbumMode && hasMultipleDiscs) {
    tracks.forEach((track: Track, index) => {
      const previousTrack = tracks[index - 1]
      const isNewDisc = track.disc && previousTrack?.disc !== track.disc

      if (isNewDisc) {
        items.push({
          id: `disc=${track.disc}`,
          type: 'disc',
          disc: track.disc,
        })
      }
      items.push({
        ...track,
        type: 'track',
      })
    })
  } else {
    items = tracks
  }

  return {
    items,
    orderBy,
    currentItem,
    orderByOptions,
    onSortChangeHandler,
    onItemClick,
    handlePlayNow,
    handleAddToQueue,
    isInAlbumMode,
  }
}
