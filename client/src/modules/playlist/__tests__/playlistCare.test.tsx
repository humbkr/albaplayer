import { libraryInitialState, LibraryStateType } from '../../library/redux'
import { findSimilarTracks } from '../utils/playlistCare'

const mockLibraryState: LibraryStateType = {
  ...libraryInitialState,
  isInitialized: true,
  artists: {
    1: {
      id: '1',
      name: 'Artist 1',
    },
    2: {
      id: '2',
      name: 'Artist 2',
    },
    3: {
      id: '3',
      name: 'Various artists',
    },
  },
  albums: {
    1: {
      id: '1',
      title: 'Album from artist 1',
      year: '1986',
      artistId: '1',
      dateAdded: 1614682652,
    },
    2: {
      id: '2',
      title: 'Album from artist 2',
      year: '2002',
      artistId: '2',
      dateAdded: 1614682652,
    },
    3: {
      id: '3',
      title: 'Compilation 1',
      year: '1992',
      artistId: '3',
      dateAdded: 1614682652,
    },
  },
  tracks: {
    1: {
      id: '1',
      title: 'Track 1 on album 1 from artist 1',
      number: 1,
      disc: '',
      duration: 123,
      cover: '',
      albumId: '1',
      artistId: '1',
    },
    2: {
      id: '2',
      title: 'Track 1 on album 2 from artist 2',
      number: 1,
      disc: '',
      duration: 124,
      cover: '',
      albumId: '2',
      artistId: '2',
    },
    3: {
      id: '3',
      title: 'Same track name on different albums',
      number: 2,
      disc: '',
      duration: 124,
      cover: '',
      albumId: '1',
      artistId: '1',
    },
    4: {
      id: '4',
      title: 'Same track name on different albums',
      number: 1,
      disc: '',
      duration: 124,
      cover: '',
      albumId: '3',
      artistId: '1',
    },
    5: {
      id: '5',
      title: 'Same track name on same album from different artist',
      number: 2,
      disc: '',
      duration: 124,
      cover: '',
      albumId: '3',
      artistId: '1',
    },
    6: {
      id: '6',
      title: 'Same track name on same album from different artist',
      number: 3,
      disc: '',
      duration: 124,
      cover: '',
      albumId: '3',
      artistId: '2',
    },
    7: {
      id: '7',
      title: 'Same track name on same album from same artist',
      number: 1,
      disc: '',
      duration: 124,
      cover: '',
      albumId: '3',
      artistId: '1',
    },
    8: {
      id: '8',
      title: 'Same track name on same album from same artist',
      number: 2,
      disc: '',
      duration: 125,
      cover: '',
      albumId: '3',
      artistId: '1',
    },
    9: {
      id: '9',
      title: 'Exact same track',
      number: 1,
      disc: '',
      duration: 124,
      cover: '',
      albumId: '3',
      artistId: '1',
    },
    10: {
      id: '10',
      title: 'Exact same track',
      number: 1,
      disc: '',
      duration: 124,
      cover: '',
      albumId: '3',
      artistId: '1',
    },
    11: {
      id: '11',
      title: 'Unique trackTitle match no ids',
      number: 1,
      disc: '',
      duration: 124,
      cover: '',
    },
    12: {
      id: '12',
      title: 'Unique trackTitle and albumTitle match no artist id',
      number: 1,
      disc: '',
      duration: 124,
      cover: '',
      albumId: '1',
    },
    13: {
      id: '13',
      title: 'Unique trackTitle and albumTitle match no artist id',
      number: 1,
      disc: '',
      duration: 124,
      cover: '',
      albumId: '2',
    },
  },
}

describe('playlistCare', () => {
  describe('findSimilarTracks', () => {
    it('should find only one track when only one track is a direct match', () => {
      const toSearch: Track = {
        id: '23',
        title: 'Track 1 on album 2 from artist 2',
        number: 1,
        disc: '',
        duration: 124,
        cover: '',
        albumId: '23',
        artistId: '23',
        album: {
          id: '23',
          title: 'Album from artist 2',
          year: '2002',
          artistId: '23',
          dateAdded: 1614682652,
        },
        artist: {
          id: '23',
          name: 'Artist 2',
        },
      }

      const result = findSimilarTracks(toSearch, mockLibraryState)
      expect(result).toBeArray()
      expect(result.length).toBe(1)

      const toSearch2: Track = {
        id: '23',
        title: 'Unique trackTitle match no ids',
        number: 15,
        disc: '',
        duration: 124,
        cover: '',
        album: {
          id: '25',
          title: 'Album from artist 2',
          year: '2002',
          artistId: '25',
          dateAdded: 1614682652,
        },
        artist: {
          id: '25',
          name: 'Artist 2',
        },
      }

      const result2 = findSimilarTracks(toSearch2, mockLibraryState)
      expect(result2).toBeArray()
      expect(result2.length).toBe(1)
    })

    it('should find only one track when only one track is a match with track title and album title', () => {
      const toSearch: Track = {
        id: '31',
        title: 'Same track name on different albums',
        number: 2,
        disc: '',
        duration: 124,
        cover: '',
        albumId: '11',
        artistId: '11',
        album: {
          id: '11',
          title: 'Album from artist 1',
          year: '2002',
          artistId: '11',
          dateAdded: 1614682652,
        },
        artist: {
          id: '11',
          name: 'Artist 1',
        },
      }

      const result = findSimilarTracks(toSearch, mockLibraryState)
      expect(result).toBeArray()
      expect(result.length).toBe(1)

      const toSearch2: Track = {
        id: '31',
        title: 'Unique trackTitle and albumTitle match no artist id',
        number: 2,
        disc: '',
        duration: 124,
        cover: '',
        albumId: '11',
        artistId: '11',
        album: {
          id: '11',
          title: 'Album from artist 1',
          year: '2002',
          artistId: '11',
          dateAdded: 1614682652,
        },
        artist: {
          id: '11',
          name: 'Artist 1',
        },
      }

      const result2 = findSimilarTracks(toSearch2, mockLibraryState)
      expect(result2).toBeArray()
      expect(result2.length).toBe(1)
    })

    it('should find only one track when only one track is a match with track title, album title, and artist name', () => {
      const toSearch: Track = {
        id: '51',
        title: 'Same track name on same album from different artist',
        number: 2,
        disc: '',
        duration: 124,
        cover: '',
        albumId: '31',
        artistId: '11',
        album: {
          id: '31',
          title: 'Compilation 1',
          year: '2002',
          artistId: '11',
          dateAdded: 1614682652,
        },
        artist: {
          id: '11',
          name: 'Artist 1',
        },
      }

      const result = findSimilarTracks(toSearch, mockLibraryState)
      expect(result).toBeArray()
      expect(result.length).toBe(1)
    })

    it('should find multiple tracks when multiple tracks match', () => {
      const toSearch: Track = {
        id: '91',
        title: 'Exact same track',
        number: 1,
        disc: '',
        duration: 124,
        cover: '',
        albumId: '31',
        artistId: '11',
        album: {
          id: '31',
          title: 'Compilation 1',
          year: '2002',
          artistId: '11',
          dateAdded: 1614682652,
        },
        artist: {
          id: '11',
          name: 'Artist 1',
        },
      }

      const result = findSimilarTracks(toSearch, mockLibraryState)
      expect(result).toBeArray()
      expect(result.length).toBe(2)
    })

    it('should find multiple tracks when multiple tracks match - no artist', () => {
      const toSearch: Track = {
        id: '91',
        title: 'Exact same track',
        number: 1,
        disc: '',
        duration: 124,
        cover: '',
        albumId: '31',
        artistId: '11',
        album: {
          id: '31',
          title: 'Compilation 1',
          year: '2002',
          artistId: '11',
          dateAdded: 1614682652,
        },
      }

      const result = findSimilarTracks(toSearch, mockLibraryState)
      expect(result).toBeArray()
      expect(result.length).toBe(2)
    })

    it('should find multiple tracks when multiple tracks match - no artist, no album', () => {
      const toSearch: Track = {
        id: '91',
        title: 'Exact same track',
        number: 1,
        disc: '',
        duration: 124,
        cover: '',
        albumId: '31',
        artistId: '11',
      }

      const result = findSimilarTracks(toSearch, mockLibraryState)
      expect(result).toBeArray()
      expect(result.length).toBe(2)
    })

    it('should find no track when no track matches', () => {
      const toSearch: Track = {
        id: '97',
        title: 'Non existent track',
        number: 1,
        disc: '',
        duration: 124,
        cover: '',
        albumId: '31',
        artistId: '11',
        album: {
          id: '31',
          title: 'Album from artist 1',
          year: '2002',
          artistId: '11',
          dateAdded: 1614682652,
        },
        artist: {
          id: '11',
          name: 'Artist 1',
        },
      }

      const result = findSimilarTracks(toSearch, mockLibraryState)
      expect(result).toBeArray()
      expect(result.length).toBe(0)
    })
  })
})
