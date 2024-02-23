import { renderHook } from '@testing-library/react'
import {
  useAddAlbumToPlaylist,
  useAddArtistToPlaylist,
  useAddCurrentQueueToPlaylist,
  useAddPlaylistToPlaylist,
  useAddTrackToPlaylist,
  useCreatePlaylist,
  useDeletePlaylist,
  useGetCurrentPlaylist,
  useGetTracksFromPlaylist,
  useRemoveTrackFromPlaylist,
  useUpdatePlaylistInfo,
  useUpdatePlaylistItems,
} from 'modules/collections/services/services'
import {
  useCreateCollectionMutation,
  useDeleteCollectionMutation,
  useGetCollectionsQuery,
  useUpdateCollectionMutation,
} from 'modules/collections/services/api'
import { useAppSelector } from 'store/hooks'
import { COLLECTION_TYPE } from 'modules/collections/utils/constants'
import store from 'store/store'

jest.mock('store/store', () => ({
  getState: jest.fn(),
}))

jest.mock('store/hooks')
const useAppSelectorMock = useAppSelector as jest.Mock

jest.mock('modules/collections/services/api', () => ({
  useGetCollectionsQuery: jest.fn(),
  useCreateCollectionMutation: jest.fn(),
  useUpdateCollectionMutation: jest.fn(),
  useDeleteCollectionMutation: jest.fn(),
}))
const useGetCollectionsQueryMock = useGetCollectionsQuery as jest.Mock
const useCreateCollectionMutationMock = useCreateCollectionMutation as jest.Mock
const useUpdateCollectionMutationMock = useUpdateCollectionMutation as jest.Mock
const useDeleteCollectionMutationMock = useDeleteCollectionMutation as jest.Mock

const mockCreateCollection = jest.fn()
const mockUpdateCollection = jest.fn()

describe('Collections > services', () => {
  beforeEach(() => {
    store.getState.mockReturnValue({
      queue: {
        items: [
          {
            track: {
              id: 'track03',
              title: 'trackTitle03',
              src: 'trackSrc03',
              artistId: 'artist03',
              albumId: 'album01',
              artist: { id: 'artist01', name: 'artistName01' },
              album: { id: 'album01', title: 'albumTitle01' },
            },
            position: 1,
          },
        ],
      },
      library: {
        tracks: {
          track01: {
            id: 'track01',
            title: 'trackTitle01',
            src: 'trackSrc01',
            artistId: 'artist01',
            albumId: 'album01',
          },
          track02: {
            id: 'track02',
            title: 'trackTitle02',
            src: 'trackSrc02',
            artistId: 'artist02',
            albumId: 'album02',
          },
        },
        artists: {
          artist01: { id: 'artist01', name: 'artistName01' },
          artist02: { id: 'artist02', name: 'artistName02' },
        },
        albums: {
          album01: { id: 'album01', title: 'albumTitle01' },
          album02: { id: 'album02', title: 'albumTitle02' },
        },
      },
    })

    useCreateCollectionMutationMock.mockReturnValue([mockCreateCollection])
    useUpdateCollectionMutationMock.mockReturnValue([mockUpdateCollection])
  })

  describe('useGetCurrentPlaylist', () => {
    test('should return the current playlist when there is one', () => {
      useGetCollectionsQueryMock.mockReturnValue({
        data: {
          playlists: [
            {
              id: 'playlistId',
              title: 'playlistTitle',
              dateAdded: 0,
              dateModified: 0,
              items: [],
            },
          ],
        },
      })
      useAppSelectorMock.mockReturnValue('playlistId')

      const { result } = renderHook(() => useGetCurrentPlaylist())
      expect(result.current).toStrictEqual({
        id: 'playlistId',
        title: 'playlistTitle',
        dateAdded: 0,
        dateModified: 0,
        items: [],
      })
    })

    test('should return undefined when no playlist is found', () => {
      useGetCollectionsQueryMock.mockReturnValue({ data: { playlists: [] } })

      const { result } = renderHook(() => useGetCurrentPlaylist())

      expect(result.current).toBe(undefined)
    })
  })

  describe('useCreatePlaylist', () => {
    test('should prepare the correct data to send to the API when creating a playlist with no tracks', () => {
      useCreateCollectionMutationMock.mockReturnValue([mockCreateCollection])

      const { result } = renderHook(() => useCreatePlaylist())

      result.current({ title: 'playlistTitle', tracks: [] })

      expect(mockCreateCollection).toHaveBeenCalledWith({
        title: 'playlistTitle',
        type: COLLECTION_TYPE.tracks,
        items: JSON.stringify([]),
      })
    })

    test('should prepare the correct data to send to the API when creating a playlist with tracks', () => {
      useCreateCollectionMutationMock.mockReturnValue([mockCreateCollection])

      const { result } = renderHook(() => useCreatePlaylist())

      result.current({
        title: 'playlistTitle',
        tracks: [
          { id: 'track01', title: 'trackTitle01', src: 'trackSrc01' },
          { id: 'track02', title: 'trackTitle02', src: 'trackSrc02' },
        ],
      })

      expect(mockCreateCollection).toHaveBeenCalledWith({
        title: 'playlistTitle',
        type: COLLECTION_TYPE.tracks,
        items: JSON.stringify([
          {
            track: { id: 'track01', title: 'trackTitle01', src: 'trackSrc01' },
            position: 1,
          },
          {
            track: { id: 'track02', title: 'trackTitle02', src: 'trackSrc02' },
            position: 2,
          },
        ]),
      })
    })
  })

  describe('useAddTrackToPlaylist', () => {
    beforeEach(() => {
      useGetCollectionsQueryMock.mockReturnValue({
        data: {
          playlists: [
            {
              id: 'playlistId',
              title: 'playlistTitle',
              dateAdded: 0,
              dateModified: 0,
              items: [
                {
                  track: {
                    id: 'track01',
                    title: 'trackTitle01',
                    src: 'trackSrc01',
                    artistId: 'artist01',
                    albumId: 'album01',
                    artist: { id: 'artist01', name: 'artistName01' },
                    album: { id: 'album01', title: 'albumTitle01' },
                  },
                  position: 1,
                },
              ],
            },
          ],
        },
      })
    })

    test('adds track to an existing playlist', () => {
      const { result } = renderHook(() => useAddTrackToPlaylist())

      result.current({ playlistId: 'playlistId', trackId: 'track02' })

      expect(mockCreateCollection).not.toHaveBeenCalled()
      expect(mockUpdateCollection).toHaveBeenCalledWith({
        id: 'playlistId',
        type: COLLECTION_TYPE.tracks,
        title: 'playlistTitle',
        items: JSON.stringify([
          {
            track: {
              id: 'track01',
              title: 'trackTitle01',
              src: 'trackSrc01',
              artistId: 'artist01',
              albumId: 'album01',
              artist: { id: 'artist01', name: 'artistName01' },
              album: { id: 'album01', title: 'albumTitle01' },
            },
            position: 1,
          },
          {
            track: {
              id: 'track02',
              title: 'trackTitle02',
              src: 'trackSrc02',
              artistId: 'artist02',
              albumId: 'album02',
              artist: { id: 'artist02', name: 'artistName02' },
              album: { id: 'album02', title: 'albumTitle02' },
            },
            position: 2,
          },
        ]),
      })
    })

    test('adds track to a new playlist', () => {
      const { result } = renderHook(() => useAddTrackToPlaylist())

      result.current({ trackId: 'track02' })

      expect(mockUpdateCollection).not.toHaveBeenCalled()
      expect(mockCreateCollection).toHaveBeenCalledWith({
        id: undefined,
        title: 'playlists.defaultPlaylistName',
        type: COLLECTION_TYPE.tracks,
        items: JSON.stringify([
          {
            track: {
              id: 'track02',
              title: 'trackTitle02',
              src: 'trackSrc02',
              artistId: 'artist02',
              albumId: 'album02',
              artist: { id: 'artist02', name: 'artistName02' },
              album: { id: 'album02', title: 'albumTitle02' },
            },
            position: 1,
          },
        ]),
      })
    })
  })

  describe('useAddAlbumToPlaylist', () => {
    beforeEach(() => {
      useGetCollectionsQueryMock.mockReturnValue({
        data: {
          playlists: [
            {
              id: 'playlistId',
              title: 'playlistTitle',
              dateAdded: 0,
              dateModified: 0,
              items: [
                {
                  track: {
                    id: 'track01',
                    title: 'trackTitle01',
                    src: 'trackSrc01',
                    artistId: 'artist01',
                    albumId: 'album01',
                    artist: { id: 'artist01', name: 'artistName01' },
                    album: { id: 'album01', title: 'albumTitle01' },
                  },
                  position: 1,
                },
              ],
            },
          ],
        },
      })
    })

    test('adds album to an existing playlist', () => {
      const { result } = renderHook(() => useAddAlbumToPlaylist())

      result.current({ playlistId: 'playlistId', albumId: 'album02' })

      expect(mockCreateCollection).not.toHaveBeenCalled()
      expect(mockUpdateCollection).toHaveBeenCalledWith({
        id: 'playlistId',
        type: COLLECTION_TYPE.tracks,
        title: 'playlistTitle',
        items: JSON.stringify([
          {
            track: {
              id: 'track01',
              title: 'trackTitle01',
              src: 'trackSrc01',
              artistId: 'artist01',
              albumId: 'album01',
              artist: { id: 'artist01', name: 'artistName01' },
              album: { id: 'album01', title: 'albumTitle01' },
            },
            position: 1,
          },
          {
            track: {
              id: 'track02',
              title: 'trackTitle02',
              src: 'trackSrc02',
              artistId: 'artist02',
              albumId: 'album02',
              artist: { id: 'artist02', name: 'artistName02' },
              album: { id: 'album02', title: 'albumTitle02' },
            },
            position: 2,
          },
        ]),
      })
    })

    test('adds album to a new playlist', () => {
      const { result } = renderHook(() => useAddAlbumToPlaylist())

      result.current({ albumId: 'album02' })

      expect(mockUpdateCollection).not.toHaveBeenCalled()
      expect(mockCreateCollection).toHaveBeenCalledWith({
        id: undefined,
        title: 'playlists.defaultPlaylistName',
        type: COLLECTION_TYPE.tracks,
        items: JSON.stringify([
          {
            track: {
              id: 'track02',
              title: 'trackTitle02',
              src: 'trackSrc02',
              artistId: 'artist02',
              albumId: 'album02',
              artist: { id: 'artist02', name: 'artistName02' },
              album: { id: 'album02', title: 'albumTitle02' },
            },
            position: 1,
          },
        ]),
      })
    })
  })

  describe('useAddArtistToPlaylist', () => {
    beforeEach(() => {
      useGetCollectionsQueryMock.mockReturnValue({
        data: {
          playlists: [
            {
              id: 'playlistId',
              title: 'playlistTitle',
              dateAdded: 0,
              dateModified: 0,
              items: [
                {
                  track: {
                    id: 'track01',
                    title: 'trackTitle01',
                    src: 'trackSrc01',
                    artistId: 'artist01',
                    albumId: 'album01',
                    artist: { id: 'artist01', name: 'artistName01' },
                    album: { id: 'album01', title: 'albumTitle01' },
                  },
                  position: 1,
                },
              ],
            },
          ],
        },
      })
    })

    test('adds artist to an existing playlist', () => {
      const { result } = renderHook(() => useAddArtistToPlaylist())

      result.current({ playlistId: 'playlistId', artistId: 'artist02' })

      expect(mockCreateCollection).not.toHaveBeenCalled()
      expect(mockUpdateCollection).toHaveBeenCalledWith({
        id: 'playlistId',
        type: COLLECTION_TYPE.tracks,
        title: 'playlistTitle',
        items: JSON.stringify([
          {
            track: {
              id: 'track01',
              title: 'trackTitle01',
              src: 'trackSrc01',
              artistId: 'artist01',
              albumId: 'album01',
              artist: { id: 'artist01', name: 'artistName01' },
              album: { id: 'album01', title: 'albumTitle01' },
            },
            position: 1,
          },
          {
            track: {
              id: 'track02',
              title: 'trackTitle02',
              src: 'trackSrc02',
              artistId: 'artist02',
              albumId: 'album02',
              artist: { id: 'artist02', name: 'artistName02' },
              album: { id: 'album02', title: 'albumTitle02' },
            },
            position: 2,
          },
        ]),
      })
    })

    test('adds artist to a new playlist', () => {
      const { result } = renderHook(() => useAddArtistToPlaylist())

      result.current({ artistId: 'artist02' })

      expect(mockUpdateCollection).not.toHaveBeenCalled()
      expect(mockCreateCollection).toHaveBeenCalledWith({
        id: undefined,
        title: 'playlists.defaultPlaylistName',
        type: COLLECTION_TYPE.tracks,
        items: JSON.stringify([
          {
            track: {
              id: 'track02',
              title: 'trackTitle02',
              src: 'trackSrc02',
              artistId: 'artist02',
              albumId: 'album02',
              artist: { id: 'artist02', name: 'artistName02' },
              album: { id: 'album02', title: 'albumTitle02' },
            },
            position: 1,
          },
        ]),
      })
    })
  })

  describe('useAddPlaylistToPlaylist', () => {
    beforeEach(() => {
      useGetCollectionsQueryMock.mockReturnValue({
        data: {
          playlists: [
            {
              id: 'playlist01',
              title: 'playlist01',
              dateAdded: 0,
              dateModified: 0,
              items: [
                {
                  track: {
                    id: 'track01',
                    title: 'trackTitle01',
                    src: 'trackSrc01',
                    artistId: 'artist01',
                    albumId: 'album01',
                    artist: { id: 'artist01', name: 'artistName01' },
                    album: { id: 'album01', title: 'albumTitle01' },
                  },
                  position: 1,
                },
              ],
            },
            {
              id: 'playlist02',
              title: 'playlist02',
              dateAdded: 0,
              dateModified: 0,
              items: [
                {
                  track: {
                    id: 'track02',
                    title: 'trackTitle02',
                    src: 'trackSrc02',
                    artistId: 'artist02',
                    albumId: 'album02',
                    artist: { id: 'artist02', name: 'artistName02' },
                    album: { id: 'album02', title: 'albumTitle02' },
                  },
                  position: 1,
                },
              ],
            },
          ],
        },
      })
    })

    test('adds playlist to an existing playlist', () => {
      const { result } = renderHook(() => useAddPlaylistToPlaylist())

      result.current({
        playlistId: 'playlist01',
        playlistToAddId: 'playlist02',
      })

      expect(mockCreateCollection).not.toHaveBeenCalled()
      expect(mockUpdateCollection).toHaveBeenCalledWith({
        id: 'playlist01',
        type: COLLECTION_TYPE.tracks,
        title: 'playlist01',
        items: JSON.stringify([
          {
            track: {
              id: 'track01',
              title: 'trackTitle01',
              src: 'trackSrc01',
              artistId: 'artist01',
              albumId: 'album01',
              artist: { id: 'artist01', name: 'artistName01' },
              album: { id: 'album01', title: 'albumTitle01' },
            },
            position: 1,
          },
          {
            track: {
              id: 'track02',
              title: 'trackTitle02',
              src: 'trackSrc02',
              artistId: 'artist02',
              albumId: 'album02',
              artist: { id: 'artist02', name: 'artistName02' },
              album: { id: 'album02', title: 'albumTitle02' },
            },
            position: 2,
          },
        ]),
      })
    })

    test('adds playlist to a new playlist', () => {
      const { result } = renderHook(() => useAddPlaylistToPlaylist())

      result.current({ playlistToAddId: 'playlist02' })

      expect(mockUpdateCollection).not.toHaveBeenCalled()
      expect(mockCreateCollection).toHaveBeenCalledWith({
        id: undefined,
        title: 'playlists.defaultPlaylistName',
        type: COLLECTION_TYPE.tracks,
        items: JSON.stringify([
          {
            track: {
              id: 'track02',
              title: 'trackTitle02',
              src: 'trackSrc02',
              artistId: 'artist02',
              albumId: 'album02',
              artist: { id: 'artist02', name: 'artistName02' },
              album: { id: 'album02', title: 'albumTitle02' },
            },
            position: 1,
          },
        ]),
      })
    })

    test('does nothing if playlist to add does not exist', () => {
      const { result } = renderHook(() => useAddPlaylistToPlaylist())

      result.current({ playlistToAddId: 'whatever' })

      expect(mockUpdateCollection).not.toHaveBeenCalled()
      expect(mockCreateCollection).not.toHaveBeenCalled()
    })
  })

  describe('useAddCurrentQueueToPlaylist', () => {
    beforeEach(() => {
      useCreateCollectionMutationMock.mockReturnValue([mockCreateCollection])
      useUpdateCollectionMutationMock.mockReturnValue([mockUpdateCollection])
      useGetCollectionsQueryMock.mockReturnValue({
        data: {
          playlists: [
            {
              id: 'playlist01',
              title: 'playlist01',
              dateAdded: 0,
              dateModified: 0,
              items: [
                {
                  track: {
                    id: 'track01',
                    title: 'trackTitle01',
                    src: 'trackSrc01',
                    artistId: 'artist01',
                    albumId: 'album01',
                    artist: { id: 'artist01', name: 'artistName01' },
                    album: { id: 'album01', title: 'albumTitle01' },
                  },
                  position: 1,
                },
              ],
            },
          ],
        },
      })
    })

    test('adds current queue to an existing playlist', () => {
      const { result } = renderHook(() => useAddCurrentQueueToPlaylist())

      result.current('playlist01')

      expect(mockCreateCollection).not.toHaveBeenCalled()
      expect(mockUpdateCollection).toHaveBeenCalledWith({
        id: 'playlist01',
        type: COLLECTION_TYPE.tracks,
        title: 'playlist01',
        items: JSON.stringify([
          {
            track: {
              id: 'track01',
              title: 'trackTitle01',
              src: 'trackSrc01',
              artistId: 'artist01',
              albumId: 'album01',
              artist: { id: 'artist01', name: 'artistName01' },
              album: { id: 'album01', title: 'albumTitle01' },
            },
            position: 1,
          },
          {
            track: {
              id: 'track03',
              title: 'trackTitle03',
              src: 'trackSrc03',
              artistId: 'artist03',
              albumId: 'album01',
              artist: { id: 'artist01', name: 'artistName01' },
              album: { id: 'album01', title: 'albumTitle01' },
            },
            position: 2,
          },
        ]),
      })
    })

    test('adds current queue to a new playlist', () => {
      const { result } = renderHook(() => useAddCurrentQueueToPlaylist())

      result.current()

      expect(mockUpdateCollection).not.toHaveBeenCalled()
      expect(mockCreateCollection).toHaveBeenCalledWith({
        id: undefined,
        title: 'playlists.defaultPlaylistName',
        type: COLLECTION_TYPE.tracks,
        items: JSON.stringify([
          {
            track: {
              id: 'track03',
              title: 'trackTitle03',
              src: 'trackSrc03',
              artistId: 'artist03',
              albumId: 'album01',
              artist: { id: 'artist01', name: 'artistName01' },
              album: { id: 'album01', title: 'albumTitle01' },
            },
            position: 1,
          },
        ]),
      })
    })

    test('does nothing if playlist to add does not exist', () => {
      store.getState.mockReturnValue({
        queue: {
          items: [],
        },
        library: {
          tracks: {},
          artists: {},
          albums: {},
        },
      })

      const { result } = renderHook(() => useAddCurrentQueueToPlaylist())

      result.current('playlist01')

      expect(mockUpdateCollection).not.toHaveBeenCalled()
      expect(mockCreateCollection).not.toHaveBeenCalled()
    })
  })

  describe('useRemoveTrackFromPlaylist', () => {
    beforeEach(() => {
      useUpdateCollectionMutationMock.mockReturnValue([mockUpdateCollection])
      useGetCollectionsQueryMock.mockReturnValue({
        data: {
          playlists: [
            {
              id: 'playlistId',
              title: 'playlistTitle',
              dateAdded: 0,
              dateModified: 0,
              items: [
                {
                  track: {
                    id: 'track01',
                    title: 'trackTitle01',
                    src: 'trackSrc01',
                    artistId: 'artist01',
                    albumId: 'album01',
                    artist: { id: 'artist01', name: 'artistName01' },
                    album: { id: 'album01', title: 'albumTitle01' },
                  },
                  position: 1,
                },
                {
                  track: {
                    id: 'track02',
                    title: 'trackTitle02',
                    src: 'trackSrc02',
                    artistId: 'artist02',
                    albumId: 'album02',
                    artist: { id: 'artist02', name: 'artistName02' },
                    album: { id: 'album02', title: 'albumTitle02' },
                  },
                  position: 2,
                },
              ],
            },
          ],
        },
      })
    })

    test('removes a track from a playlist', () => {
      const { result } = renderHook(() => useRemoveTrackFromPlaylist())

      result.current(1, 'playlistId')

      expect(mockUpdateCollection).toHaveBeenCalledWith({
        id: 'playlistId',
        type: COLLECTION_TYPE.tracks,
        title: 'playlistTitle',
        items: JSON.stringify([
          {
            track: {
              id: 'track02',
              title: 'trackTitle02',
              src: 'trackSrc02',
              artistId: 'artist02',
              albumId: 'album02',
              artist: { id: 'artist02', name: 'artistName02' },
              album: { id: 'album02', title: 'albumTitle02' },
            },
            position: 1,
          },
        ]),
      })
    })

    test('does nothing if playlist does not exist', () => {
      const { result } = renderHook(() => useRemoveTrackFromPlaylist())

      result.current(1, 'whatever')

      expect(mockUpdateCollection).not.toHaveBeenCalled()
    })
  })

  describe('useUpdatePlaylistItems', () => {
    const newItems = [
      {
        track: {
          id: 'track01',
          title: 'trackTitle01',
          src: 'trackSrc01',
          artistId: 'artist01',
          albumId: 'album01',
          artist: { id: 'artist01', name: 'artistName01' },
          album: {
            id: 'album01',
            title: 'albumTitle01',
            year: '2020',
            dateAdded: 0,
          },
        },
        position: 1,
      },
      {
        track: {
          id: 'track03',
          title: 'trackTitle03',
          src: 'trackSrc03',
          artistId: 'artist03',
          albumId: 'album01',
          artist: { id: 'artist01', name: 'artistName01' },
          album: {
            id: 'album01',
            title: 'albumTitle01',
            year: '2021',
            dateAdded: 0,
          },
        },
        position: 1,
      },
      {
        track: {
          id: 'track02',
          title: 'trackTitle02',
          src: 'trackSrc02',
          artistId: 'artist02',
          albumId: 'album02',
          artist: { id: 'artist02', name: 'artistName02' },
          album: {
            id: 'album02',
            title: 'albumTitle02',
            year: '2022',
            dateAdded: 0,
          },
        },
        position: 2,
      },
    ]

    beforeEach(() => {
      useUpdateCollectionMutationMock.mockReturnValue([mockUpdateCollection])
      useGetCollectionsQueryMock.mockReturnValue({
        data: {
          playlists: [
            {
              id: 'playlistId',
              title: 'playlistTitle',
              dateAdded: 0,
              dateModified: 0,
              items: [
                {
                  track: {
                    id: 'track01',
                    title: 'trackTitle01',
                    src: 'trackSrc01',
                    artistId: 'artist01',
                    albumId: 'album01',
                    artist: { id: 'artist01', name: 'artistName01' },
                    album: { id: 'album01', title: 'albumTitle01' },
                  },
                  position: 1,
                },
                {
                  track: {
                    id: 'track02',
                    title: 'trackTitle02',
                    src: 'trackSrc02',
                    artistId: 'artist02',
                    albumId: 'album02',
                    artist: { id: 'artist02', name: 'artistName02' },
                    album: { id: 'album02', title: 'albumTitle02' },
                  },
                  position: 2,
                },
              ],
            },
          ],
        },
      })
    })

    test('updates a playlist items', () => {
      const { result } = renderHook(() => useUpdatePlaylistItems())

      result.current(newItems, 'playlistId')

      expect(mockUpdateCollection).toHaveBeenCalledWith({
        id: 'playlistId',
        type: COLLECTION_TYPE.tracks,
        title: 'playlistTitle',
        items: JSON.stringify([
          {
            track: {
              id: 'track01',
              title: 'trackTitle01',
              src: 'trackSrc01',
              artistId: 'artist01',
              albumId: 'album01',
              artist: { id: 'artist01', name: 'artistName01' },
              album: {
                id: 'album01',
                title: 'albumTitle01',
                year: '2020',
                dateAdded: 0,
              },
            },
            position: 1,
          },
          {
            track: {
              id: 'track03',
              title: 'trackTitle03',
              src: 'trackSrc03',
              artistId: 'artist03',
              albumId: 'album01',
              artist: { id: 'artist01', name: 'artistName01' },
              album: {
                id: 'album01',
                title: 'albumTitle01',
                year: '2021',
                dateAdded: 0,
              },
            },
            position: 2,
          },
          {
            track: {
              id: 'track02',
              title: 'trackTitle02',
              src: 'trackSrc02',
              artistId: 'artist02',
              albumId: 'album02',
              artist: { id: 'artist02', name: 'artistName02' },
              album: {
                id: 'album02',
                title: 'albumTitle02',
                year: '2022',
                dateAdded: 0,
              },
            },
            position: 3,
          },
        ]),
      })
    })

    test('does nothing if playlist does not exist', () => {
      const { result } = renderHook(() => useUpdatePlaylistItems())

      result.current(newItems, 'whatever')

      expect(mockUpdateCollection).not.toHaveBeenCalled()
    })
  })

  describe('useUpdatePlaylistInfo', () => {
    beforeEach(() => {
      useUpdateCollectionMutationMock.mockReturnValue([mockUpdateCollection])
    })

    test('updates a playlist information', () => {
      const { result } = renderHook(() => useUpdatePlaylistInfo())

      const playlist: Playlist = {
        id: 'playlistId',
        title: 'playlistTitle',
        dateCreated: 0,
        dateModified: 0,
        items: [],
      }

      result.current(playlist)

      expect(mockUpdateCollection).toHaveBeenCalledWith({
        id: 'playlistId',
        type: COLLECTION_TYPE.tracks,
        title: 'playlistTitle',
        items: JSON.stringify([]),
      })
    })

    test('updates a playlist information and set a default title if not title provided', () => {
      const { result } = renderHook(() => useUpdatePlaylistInfo())

      const playlist: Playlist = {
        id: 'playlistId',
        title: '',
        dateCreated: 0,
        dateModified: 0,
        items: [],
      }

      result.current(playlist)

      expect(mockUpdateCollection).toHaveBeenCalledWith({
        id: 'playlistId',
        type: COLLECTION_TYPE.tracks,
        title: 'playlists.defaultPlaylistName',
        items: JSON.stringify([]),
      })
    })
  })

  describe('useDeletePlaylist', () => {
    const mockDeleteCollection = jest.fn()

    beforeEach(() => {
      useDeleteCollectionMutationMock.mockReturnValue([mockDeleteCollection])
    })

    test('deletes a playlist', () => {
      const { result } = renderHook(() => useDeletePlaylist())

      result.current('playlistId')

      expect(mockDeleteCollection).toHaveBeenCalledWith('playlistId')
    })
  })

  describe('useGetTracksFromPlaylist', () => {
    beforeEach(() => {
      useGetCollectionsQueryMock.mockReturnValue({
        data: {
          playlists: [
            {
              id: 'playlist01',
              title: 'playlist01',
              dateAdded: 0,
              dateModified: 0,
              items: [
                {
                  track: {
                    id: 'track01',
                    title: 'trackTitle01',
                    src: 'trackSrc01',
                    artistId: 'artist01',
                    albumId: 'album01',
                    artist: { id: 'artist01', name: 'artistName01' },
                    album: { id: 'album01', title: 'albumTitle01' },
                  },
                  position: 1,
                },
                {
                  track: {
                    id: 'track02',
                    title: 'trackTitle02',
                    src: 'trackSrc02',
                    artistId: 'artist02',
                    albumId: 'album02',
                    artist: { id: 'artist02', name: 'artistName02' },
                    album: { id: 'album02', title: 'albumTitle02' },
                  },
                  position: 2,
                },
              ],
            },
          ],
        },
      })
    })

    test('returns tracks from a playlist', () => {
      const { result } = renderHook(() => useGetTracksFromPlaylist())

      const tracks = result.current('playlist01')

      expect(tracks).toStrictEqual([
        {
          id: 'track01',
          title: 'trackTitle01',
          src: 'trackSrc01',
          artistId: 'artist01',
          albumId: 'album01',
          artist: { id: 'artist01', name: 'artistName01' },
          album: { id: 'album01', title: 'albumTitle01' },
        },
        {
          id: 'track02',
          title: 'trackTitle02',
          src: 'trackSrc02',
          artistId: 'artist02',
          albumId: 'album02',
          artist: { id: 'artist02', name: 'artistName02' },
          album: { id: 'album02', title: 'albumTitle02' },
        },
      ])
    })

    test('returns an empty array if playlist does not exist', () => {
      const { result } = renderHook(() => useGetTracksFromPlaylist())

      const tracks = result.current('whatever')

      expect(tracks).toStrictEqual([])
    })
  })
})
