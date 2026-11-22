import { useAppDispatch, useAppSelector } from 'store/hooks'
import { getTracksList, libraryBrowserSelectTrack } from 'modules/browser/store'
import type React from 'react'
import { useTranslation } from 'react-i18next'
import {
  useAddAlbumDisc,
  useAddTrack,
  usePlayAlbumDisc,
  usePlayTrack,
} from 'modules/browser/services'
import { SETTINGS_BROWSER_TRACKS_PANE_DISPLAY } from 'modules/settings/constants'
import {
  selectUserConfig,
  updateBrowserConfig,
} from 'modules/settings/userConfig'

export function useTracksPanel() {
  const { t } = useTranslation()

  const selectedAlbumId = useAppSelector(
    (state) => state.libraryBrowser.selectedAlbums
  )

  const config = useAppSelector((state) => selectUserConfig(state).browser)

  const isInAlbumMode =
    selectedAlbumId !== '0' &&
    config.tracksPaneDisplay === SETTINGS_BROWSER_TRACKS_PANE_DISPLAY.albumInfo

  const orderBy = config.sortTracks
  const tracks = useAppSelector((state) =>
    getTracksList(state, orderBy, isInAlbumMode)
  )
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
      updateBrowserConfig({
        sortTracks: event.currentTarget.value as TracksSortOptions,
      })
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
