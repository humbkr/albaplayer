import {
  convertAPICollectionToAppPlaylist,
  transformCollectionsResponse,
} from 'modules/collections/services/utils'
import { COLLECTION_TYPE } from 'modules/collections/utils/constants'

// eslint-disable-next-line max-len
const mockItemsJson =
  '[{"track":{"id":"12","title":"No Man\'s Land","number":2,"duration":0,"disc":"","cover":"/covers/2","dateAdded":1708682679,"artistId":"3","albumId":"2","artist":{"id":"3","name":"Dirty Greed","dateAdded":1708682679},"album":{"id":"2","title":"From Dawn...","year":"","cover":"/covers/2","artistId":"3","artist":{"id":"3"},"dateAdded":1708682679}},"position":1},{"track":{"id":"87","title":"Anything \'Cept The Truth","number":1,"duration":0,"disc":"","cover":"/covers/10","dateAdded":1708682679,"artistId":"5","albumId":"9","artist":{"id":"5","name":"Eagles of Death Metal","dateAdded":1708682679},"album":{"id":"9","title":"Heart On","year":"2008","cover":"/covers/10","artistId":"5","artist":{"id":"5"},"dateAdded":1708682679}},"position":2},{"track":{"id":"127","title":"Illusory Motion","number":1,"duration":0,"disc":"","cover":"/covers/13","dateAdded":1708682679,"artistId":"6","albumId":"12","artist":{"id":"6","name":"Elder","dateAdded":1708682679},"album":{"id":"12","title":"The Gold & Silver Sessions","year":"2019","cover":"/covers/13","artistId":"6","artist":{"id":"6"},"dateAdded":1708682679}},"position":3}]'

const mockitems = [
  {
    track: {
      id: '12',
      title: "No Man's Land",
      number: 2,
      duration: 0,
      disc: '',
      cover: '/covers/2',
      dateAdded: 1708682679,
      artistId: '3',
      albumId: '2',
      artist: {
        id: '3',
        name: 'Dirty Greed',
        dateAdded: 1708682679,
      },
      album: {
        id: '2',
        title: 'From Dawn...',
        year: '',
        cover: '/covers/2',
        artistId: '3',
        artist: {
          id: '3',
        },
        dateAdded: 1708682679,
      },
    },
    position: 1,
  },
  {
    track: {
      id: '87',
      title: "Anything 'Cept The Truth",
      number: 1,
      duration: 0,
      disc: '',
      cover: '/covers/10',
      dateAdded: 1708682679,
      artistId: '5',
      albumId: '9',
      artist: {
        id: '5',
        name: 'Eagles of Death Metal',
        dateAdded: 1708682679,
      },
      album: {
        id: '9',
        title: 'Heart On',
        year: '2008',
        cover: '/covers/10',
        artistId: '5',
        artist: {
          id: '5',
        },
        dateAdded: 1708682679,
      },
    },
    position: 2,
  },
  {
    track: {
      id: '127',
      title: 'Illusory Motion',
      number: 1,
      duration: 0,
      disc: '',
      cover: '/covers/13',
      dateAdded: 1708682679,
      artistId: '6',
      albumId: '12',
      artist: {
        id: '6',
        name: 'Elder',
        dateAdded: 1708682679,
      },
      album: {
        id: '12',
        title: 'The Gold & Silver Sessions',
        year: '2019',
        cover: '/covers/13',
        artistId: '6',
        artist: {
          id: '6',
        },
        dateAdded: 1708682679,
      },
    },
    position: 3,
  },
]

describe('modules > collections > services > utils', () => {
  describe('convertAPICollectionToAppPlaylist', () => {
    it('should return undefined if no API collection is provided', () => {
      const result = convertAPICollectionToAppPlaylist()
      expect(result).toEqual(undefined)
    })

    it('should correctly convert an API collection to an App playlist', () => {
      const APICollections = {
        id: '42',
        type: COLLECTION_TYPE.tracks,
        title: 'My playlist',
        items: mockItemsJson,
        dateAdded: 1709394179,
        dateModified: 1709394195,
      }

      const result = convertAPICollectionToAppPlaylist(APICollections)
      expect(result).toStrictEqual({
        id: '42',
        title: 'My playlist',
        dateCreated: 1709394179,
        dateModified: 1709394195,
        items: mockitems,
      })
    })
  })

  describe('transformCollectionsResponse', () => {
    it('should return collections sorted by types', () => {
      const collectionsApiResponse: GetCollectionsResponse = {
        collections: [
          {
            id: '64',
            type: COLLECTION_TYPE.tracks,
            title: 'playlist 1',
            items: mockItemsJson,
            dateAdded: 1709394179,
            dateModified: 1709394195,
          },
          {
            id: '42',
            type: COLLECTION_TYPE.albums,
            title: 'albums 1',
            items: '',
            dateAdded: 1709394143,
            dateModified: 1709394164,
          },
          {
            id: '23',
            type: COLLECTION_TYPE.artists,
            title: 'artists 1',
            items: '',
            dateAdded: 1709394112,
            dateModified: 1709394123,
          },
        ],
      }

      expect(
        transformCollectionsResponse(collectionsApiResponse)
      ).toStrictEqual({
        playlists: [
          {
            id: '64',
            title: 'playlist 1',
            dateCreated: 1709394179,
            dateModified: 1709394195,
            items: mockitems,
          },
        ],
      })
    })
  })
})
