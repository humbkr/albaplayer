import {
  libraryInitialState,
  LibraryStateType,
} from '../../modules/library/redux'
import { immutableSortTracks } from '../utils/utils'

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
  },
  albums: {
    1: {
      id: '1',
      title: 'Album A from artist 1',
      year: '1986',
      artistId: '1',
      dateAdded: 12242343242,
    },
    2: {
      id: '2',
      title: 'Album B from artist 1',
      year: '2002',
      artistId: '1',
      dateAdded: 12242343242,
    },
    3: {
      id: '3',
      title: 'Album C from artist 2',
      year: '1999',
      artistId: '2',
      dateAdded: 12242343242,
    },
  },
  tracks: {
    1: {
      id: '1',
      title: 'Track 1 on album A from artist 1',
      number: 1,
      disc: '',
      duration: 123,
      cover: '',
      albumId: '1',
      artistId: '1',
    },
    2: {
      id: '2',
      title: 'Track 2 on album A from artist 1',
      number: 2,
      disc: '',
      duration: 124,
      cover: '',
      albumId: '1',
      artistId: '1',
    },
    3: {
      id: '3',
      title: 'Track 1 on album B disc 1/2 from artist 1',
      number: 1,
      disc: '1/2',
      duration: 125,
      cover: '',
      albumId: '2',
      artistId: '1',
    },
    4: {
      id: '4',
      title: 'Track 2 on album B disc 1/2 from artist 1',
      number: 2,
      disc: '1/2',
      duration: 126,
      cover: '',
      albumId: '2',
      artistId: '1',
    },
    5: {
      id: '5',
      title: 'Track 1 on album B disc 2/2 from artist 1',
      number: 1,
      disc: '2/2',
      duration: 127,
      cover: '',
      albumId: '2',
      artistId: '1',
    },
    6: {
      id: '6',
      title: 'Track 2 on album B disc 2/2 from artist 1',
      number: 2,
      disc: '2/2',
      duration: 128,
      cover: '',
      albumId: '2',
      artistId: '1',
    },
    7: {
      id: '7',
      title: 'Track 1 on album C from artist 2',
      number: 1,
      disc: '',
      duration: 129,
      cover: '',
      albumId: '3',
      artistId: '2',
    },
    8: {
      id: '8',
      title: 'Track 2 on album C from artist 2',
      number: 2,
      disc: '',
      duration: 130,
      cover: '',
      albumId: '3',
      artistId: '2',
    },
    9: {
      id: '9',
      title: 'Track 3 on album C from artist 2',
      number: 3,
      disc: '',
      duration: 131,
      cover: '',
      albumId: '3',
      artistId: '2',
    },
  },
}

function shuffleArray(array: Array<any>) {
  let currentIndex = array.length
  let temporaryValue
  let randomIndex

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    // And swap it with the current element.
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return array
}

describe('common utils', () => {
  describe('immutableSortTracks', () => {
    it('correctly sort album tracks by disc then track number', () => {
      const trackListAlbumB: Track[] = [
        mockLibraryState.tracks[6],
        mockLibraryState.tracks[4],
        mockLibraryState.tracks[5],
        mockLibraryState.tracks[3],
      ]

      const sorted = immutableSortTracks(trackListAlbumB, 'album')

      expect(sorted[0]).toBe(mockLibraryState.tracks[3])
      expect(sorted[1]).toBe(mockLibraryState.tracks[4])
      expect(sorted[2]).toBe(mockLibraryState.tracks[5])
      expect(sorted[3]).toBe(mockLibraryState.tracks[6])
    })

    it('correctly sort tracks by album then disc then track number', () => {
      const trackListAll: Track[] = shuffleArray(
        Object.values(mockLibraryState.tracks)
      )

      const sorted = immutableSortTracks(trackListAll, 'album')

      expect(sorted[0]).toBe(mockLibraryState.tracks[1])
      expect(sorted[1]).toBe(mockLibraryState.tracks[2])
      expect(sorted[2]).toBe(mockLibraryState.tracks[3])
      expect(sorted[3]).toBe(mockLibraryState.tracks[4])
      expect(sorted[4]).toBe(mockLibraryState.tracks[5])
      expect(sorted[5]).toBe(mockLibraryState.tracks[6])
      expect(sorted[6]).toBe(mockLibraryState.tracks[7])
      expect(sorted[7]).toBe(mockLibraryState.tracks[8])
      expect(sorted[8]).toBe(mockLibraryState.tracks[9])
    })
  })
})
