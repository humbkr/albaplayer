import type { ShownRandomAlbums } from 'modules/dashboard/store'
import {
  dashboardInitialState,
  getLocalDay,
  pickRandomAlbums,
} from 'modules/dashboard/store'

const today = '2026-11-20'
const noneShown: ShownRandomAlbums = dashboardInitialState.shownRandomAlbums

// Creates `albumsPerArtist` albums for each of `artistCount` artists.
const createAlbums = (artistCount: number, albumsPerArtist = 1): Album[] =>
  Array.from({ length: artistCount * albumsPerArtist }, (_, index) => ({
    id: `album-${index}`,
    title: `Album ${index}`,
    year: '2000',
    artistId: `artist-${index % artistCount}`,
    dateAdded: 0,
  }))

const ids = (albums: Album[]) => albums.map((album) => album.id)
const artistIds = (albums: Album[]) => albums.map((album) => album.artistId)

describe('dashboard > store', () => {
  describe('pickRandomAlbums', () => {
    it('picks albums by distinct artists and remembers them for the day', () => {
      const albums = createAlbums(10, 3)

      const result = pickRandomAlbums(albums, 8, noneShown, today)

      expect(result.albums).toHaveLength(8)
      expect(new Set(artistIds(result.albums)).size).toBe(8)
      expect(result.shown).toEqual({
        day: today,
        albumIds: ids(result.albums),
        artistIds: artistIds(result.albums),
      })
    })

    it('does not show an album or an artist twice on the same day', () => {
      const albums = createAlbums(16, 2)

      const first = pickRandomAlbums(albums, 8, noneShown, today)
      const second = pickRandomAlbums(albums, 8, first.shown, today)

      expect(second.albums).toHaveLength(8)
      expect(new Set(artistIds([...first.albums, ...second.albums])).size).toBe(
        16
      )
      expect(second.shown.artistIds).toHaveLength(16)
    })

    it('forgets the albums shown on a previous day', () => {
      const albums = createAlbums(8)
      const shownYesterday: ShownRandomAlbums = {
        day: '2026-11-19',
        albumIds: ids(albums),
        artistIds: artistIds(albums) as string[],
      }

      const result = pickRandomAlbums(albums, 8, shownYesterday, today)

      expect(result.albums).toHaveLength(8)
      expect(result.shown.albumIds).toHaveLength(8)
      expect(result.shown.day).toBe(today)
    })

    it('starts over once every artist has been shown, without repeats in the draw', () => {
      const albums = createAlbums(10)

      const first = pickRandomAlbums(albums, 8, noneShown, today)
      const second = pickRandomAlbums(albums, 8, first.shown, today)

      // The 2 albums left for today are part of the draw.
      const notShownBefore = albums.filter(
        (album) => !first.albums.includes(album)
      )
      expect(second.albums).toEqual(expect.arrayContaining(notShownBefore))
      expect(new Set(ids(second.albums)).size).toBe(8)
      expect(second.shown.albumIds).toEqual(ids(second.albums))
    })

    it('shows several albums by an artist when there are not enough artists', () => {
      const albums = createAlbums(3, 4)

      const result = pickRandomAlbums(albums, 8, noneShown, today)

      expect(result.albums).toHaveLength(8)
      expect(new Set(ids(result.albums)).size).toBe(8)
    })

    it('shows the whole library when it is smaller than the number requested', () => {
      const albums = createAlbums(5)

      const result = pickRandomAlbums(albums, 8, noneShown, today)

      expect(ids(result.albums).sort()).toEqual(ids(albums).sort())
    })

    it('treats albums without artist as having distinct artists', () => {
      const albums = createAlbums(4).map((album) => ({
        ...album,
        artistId: undefined,
      }))

      const result = pickRandomAlbums(albums, 4, noneShown, today)

      expect(result.albums).toHaveLength(4)
      expect(new Set(result.shown.artistIds).size).toBe(4)
    })
  })

  describe('getLocalDay', () => {
    it('formats the local calendar day', () => {
      expect(getLocalDay(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05')
      expect(getLocalDay(new Date(2026, 10, 20, 0, 0))).toBe('2026-11-20')
    })
  })
})
