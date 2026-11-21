import type { PayloadAction } from '@reduxjs/toolkit'
import { createAppSlice } from 'store/createAppSlice'
import { immutableShuffle } from 'common/utils/utils'

// Albums and artists already shown in the random albums on a given day.
export type ShownRandomAlbums = {
  // Local calendar day, formatted as YYYY-MM-DD.
  day: string
  albumIds: string[]
  artistIds: string[]
}

export type DashboardStateType = {
  randomAlbumsNumber: number
  randomAlbums: Album[]
  shownRandomAlbums: ShownRandomAlbums
}

export const dashboardInitialState: DashboardStateType = {
  randomAlbumsNumber: 8,
  randomAlbums: [],
  shownRandomAlbums: { day: '', albumIds: [], artistIds: [] },
}

export const dashboardSlice = createAppSlice({
  name: 'dashboard',
  initialState: dashboardInitialState,
  reducers: {
    setRandomAlbums(
      state,
      action: PayloadAction<{ albums: Album[]; shown: ShownRandomAlbums }>
    ) {
      state.randomAlbums = action.payload.albums
      state.shownRandomAlbums = action.payload.shown
    },
  },
})

export const { setRandomAlbums } = dashboardSlice.actions

export const getLocalDay = (date: Date): string => {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${date.getFullYear()}-${month}-${day}`
}

// Albums without artist are considered as each having their own artist.
const getArtistKey = (album: Album) => album.artistId ?? `album:${album.id}`

/*
 * Picks up to `count` random albums from `pool`, each by a different artist
 * and none by an artist in `excludedArtistKeys`.
 */
const pickAlbumsByDistinctArtists = (
  pool: Album[],
  count: number,
  excludedArtistKeys: string[]
): Album[] => {
  const usedArtistKeys = new Set(excludedArtistKeys)
  const picked: Album[] = []

  for (const album of immutableShuffle(pool)) {
    if (picked.length === count) {
      break
    }

    const artistKey = getArtistKey(album)
    if (!usedArtistKeys.has(artistKey)) {
      usedArtistKeys.add(artistKey)
      picked.push(album)
    }
  }

  return picked
}

/*
 * Picks `count` random albums, avoiding the albums and artists already shown
 * today, with at most one album per artist.
 *
 * Once every artist has been shown, the day's memory starts over. Albums by
 * an already picked artist are only used when the library does not contain
 * enough artists.
 */
export const pickRandomAlbums = (
  albums: Album[],
  count: number,
  shown: ShownRandomAlbums,
  today: string
): { albums: Album[]; shown: ShownRandomAlbums } => {
  const shownToday =
    shown.day === today ? shown : { day: today, albumIds: [], artistIds: [] }
  const shownAlbumIds = new Set(shownToday.albumIds)

  const picked = pickAlbumsByDistinctArtists(
    albums.filter((album) => !shownAlbumIds.has(album.id)),
    count,
    shownToday.artistIds
  )

  if (picked.length === count) {
    return {
      albums: picked,
      shown: {
        day: today,
        albumIds: [...shownToday.albumIds, ...picked.map((album) => album.id)],
        artistIds: [...shownToday.artistIds, ...picked.map(getArtistKey)],
      },
    }
  }

  // Not enough albums left for today: start over, without repeating the
  // albums or artists already picked for this draw.
  const notPicked = (album: Album) => !picked.includes(album)
  picked.push(
    ...pickAlbumsByDistinctArtists(
      albums.filter(notPicked),
      count - picked.length,
      picked.map(getArtistKey)
    )
  )

  // Not enough artists in the library: allow several albums by an artist.
  picked.push(
    ...immutableShuffle(albums.filter(notPicked)).slice(
      0,
      count - picked.length
    )
  )

  return {
    albums: picked,
    shown: {
      day: today,
      albumIds: picked.map((album) => album.id),
      artistIds: picked.map(getArtistKey),
    },
  }
}

export const getRandomAlbums = (): AppThunk => (dispatch, getState) => {
  const { library, dashboard } = getState()

  const { albums, shown } = pickRandomAlbums(
    Object.values(library.albums),
    dashboard.randomAlbumsNumber,
    dashboard.shownRandomAlbums,
    getLocalDay(new Date())
  )

  dispatch(
    setRandomAlbums({
      albums: albums.map((album) => ({
        ...album,
        artist: library.artists[album.artistId as string],
      })),
      shown,
    })
  )
}
