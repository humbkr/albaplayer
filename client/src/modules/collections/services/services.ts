import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'store/hooks'
import { COLLECTION_TYPE } from 'modules/collections/utils/constants'
import { immutableSortTracks } from 'common/utils/utils'
import {
  useCreateCollectionMutation,
  useDeleteCollectionMutation,
  useGetCollectionsQuery,
  useUpdateCollectionMutation,
} from './api'

export function useGetCurrentPlaylist() {
  const { data: collections } = useGetCollectionsQuery()
  const playlistId = useAppSelector((state) => state.playlist.currentPlaylist)

  return getCollection(COLLECTION_TYPE.tracks, playlistId, collections)
}

export function useCreatePlaylist() {
  const [createCollection] = useCreateCollectionMutation()

  return ({ title, tracks }: { title: string; tracks: Track[] }) => {
    const playlistItems = tracks.map((item: Track, index: number) => ({
      track: item,
      position: index + 1,
    }))

    const collection = {
      title,
      type: COLLECTION_TYPE.tracks,
      items: JSON.stringify(playlistItems),
    }

    createCollection(collection)
  }
}

/**
 * Adds a track to a given playlist or create a new playlist with this track if no playlist id
 * is provided.
 */
export function useAddTrackToPlaylist() {
  const addTracksToPlaylist = useAddTracksToPlaylist()
  const library = useAppSelector((state) => state.library)

  return ({
    playlistId,
    trackId,
  }: {
    playlistId?: string
    trackId: string
  }) => {
    const track = { ...library.tracks[trackId] }
    // Hydrate track with album and artist info.

    track.artist = library.artists[track.artistId as string]
    track.album = library.albums[track.albumId as string]

    addTracksToPlaylist([track], playlistId)
  }
}

/**
 * Adds an album to a given playlist or create a new playlist with this album if no playlist id
 * is provided.
 */
export function useAddAlbumToPlaylist() {
  const addTracksToPlaylist = useAddTracksToPlaylist()
  const library = useAppSelector((state) => state.library)

  return ({
    playlistId,
    albumId,
  }: {
    playlistId?: string
    albumId: string
  }) => {
    // Get tracks from album.
    const filteredTracks = Object.values<Track>(library.tracks).filter(
      (track) => albumId === track.albumId
    )

    // Hydrate tracks with album and artist info.
    const augmentedTracks = filteredTracks.map((track) => ({
      ...track,
      artist: library.artists[track.artistId as string],
      album: library.albums[track.albumId as string],
    }))

    const sortedTracks = immutableSortTracks(augmentedTracks, 'album')

    addTracksToPlaylist(sortedTracks, playlistId)
  }
}

/**
 * Adds an album disc to a given playlist or create a new playlist with this album if no playlist id
 * is provided.
 */
export function useAddAlbumDiscToPlaylist() {
  const library = useAppSelector((state) => state.library)
  const addTracksToPlaylist = useAddTracksToPlaylist()

  return ({
    playlistId,
    albumId,
    disc,
  }: {
    playlistId?: string
    albumId: string
    disc: string
  }) => {
    // Get tracks from album disc.
    const filteredTracks = Object.values<Track>(library.tracks).filter(
      (track) => albumId === track.albumId && disc === track.disc
    )

    // Hydrate tracks with album and artist info.
    const augmentedTracks = filteredTracks.map((track) => ({
      ...track,
      artist: library.artists[track.artistId as string],
      album: library.albums[track.albumId as string],
    }))

    const sortedTracks = immutableSortTracks(augmentedTracks, 'album')

    addTracksToPlaylist(sortedTracks, playlistId)
  }
}

/**
 * Adds an artist to a given playlist or create a new playlist with this artist if no playlist id
 * is provided.
 */
export function useAddArtistToPlaylist() {
  const addTracksToPlaylist = useAddTracksToPlaylist()
  const library = useAppSelector((state) => state.library)

  return ({
    playlistId,
    artistId,
  }: {
    playlistId?: string
    artistId: string
  }) => {
    // Get tracks from artist.
    const filteredTracks = Object.values<Track>(library.tracks).filter(
      (track) => artistId === track.artistId
    )

    // Hydrate tracks with album and artist info.
    const augmentedTracks = filteredTracks.map((track) => ({
      ...track,
      artist: library.artists[track.artistId as string],
      album: library.albums[track.albumId as string],
    }))

    addTracksToPlaylist(augmentedTracks, playlistId)
  }
}

/**
 * Adds a playlist to a given playlist or create a copy of this playlist if no playlist id
 * is provided.
 */
export function useAddPlaylistToPlaylist() {
  const addTracksToPlaylist = useAddTracksToPlaylist()
  const { data: collections } = useGetCollectionsQuery()

  return ({
    playlistId,
    playlistToAddId,
  }: {
    playlistId?: string
    playlistToAddId: string
  }) => {
    const playlistToAdd = playlistToAddId
      ? getCollection(COLLECTION_TYPE.tracks, playlistToAddId, collections)
      : undefined

    if (!playlistToAdd) {
      return
    }

    const tracks = playlistToAdd.items.map((item: PlaylistItem) => item.track)

    addTracksToPlaylist(tracks, playlistId)
  }
}

/**
 * Adds the current queue to a given playlist or create a new playlist with the queue if no
 * playlist id is provided.
 */
export function useAddCurrentQueueToPlaylist() {
  const addTracksToPlaylist = useAddTracksToPlaylist()
  const queue = useAppSelector((state) => state.queue)

  return (playlistId?: string) => {
    const tracks = queue.items.map((item: QueueItem) => item.track)
    if (tracks.length === 0) {
      return
    }

    addTracksToPlaylist(tracks, playlistId)
  }
}

export function useRemoveTrackFromPlaylist() {
  const removeTracksFromPlaylist = useRemoveTracksFromPlaylist()

  return (trackPosition: number, playlistId: string) => {
    removeTracksFromPlaylist([trackPosition], playlistId)
  }
}

export function useUpdatePlaylistItems() {
  const { data: collections } = useGetCollectionsQuery()
  const [updateCollection] = useUpdateCollectionMutation()

  return (newItems: PlaylistItem[], playlistId: string) => {
    // Get collection.
    const playlist = getCollection(
      COLLECTION_TYPE.tracks,
      playlistId,
      collections
    )

    if (!playlist) {
      return
    }

    const reorderedTracks = newItems.map((item, index) => ({
      ...item,
      position: index + 1,
    }))

    const collection = {
      id: playlist.id,
      type: COLLECTION_TYPE.tracks,
      title: playlist?.title,
      items: JSON.stringify(reorderedTracks),
    }

    updateCollection(collection)
  }
}

export function useUpdatePlaylistInfo() {
  const { t } = useTranslation()
  const [updateCollection] = useUpdateCollectionMutation()

  return (playlist: Playlist) => {
    const collection = {
      id: playlist?.id,
      type: COLLECTION_TYPE.tracks,
      title: playlist?.title || t('collections.playlists.defaultPlaylistName'),
      items: JSON.stringify(playlist.items),
    }

    updateCollection(collection)
  }
}

export function useDeletePlaylist() {
  const [deleteCollection] = useDeleteCollectionMutation()

  return (playlistId: string) => {
    deleteCollection(playlistId)
  }
}

export function useGetTracksFromPlaylist() {
  const { data: { playlists = [] } = {} } = useGetCollectionsQuery()
  const library = useAppSelector((state) => state.library)

  return (playlistId: string) => {
    const playlist = playlists.find((playlist) => playlist.id === playlistId)
    if (!playlist) {
      return []
    }

    return playlist.items.map((item: PlaylistItem) => ({
      ...item.track,
      artist: item.track.artistId
        ? library.artists[item.track.artistId]
        : undefined,
      album: item.track.albumId
        ? library.albums[item.track.albumId]
        : undefined,
    }))
  }
}

function getCollection(
  collectionType: COLLECTION_TYPE,
  collectionId: string,
  collections?: Collections
) {
  if (collectionType === COLLECTION_TYPE.tracks) {
    return collections?.playlists?.find(
      (playlist: Playlist) => playlist.id === collectionId
    )
  }
}

function useAddTracksToPlaylist() {
  const { t } = useTranslation()
  const { data: collections } = useGetCollectionsQuery()
  const [createCollection] = useCreateCollectionMutation()
  const [updateCollection] = useUpdateCollectionMutation()

  return (tracks: Track[], playlistId?: string) => {
    // Get collection.
    const playlist = playlistId
      ? getCollection(COLLECTION_TYPE.tracks, playlistId, collections)
      : undefined

    const newTrackList = playlist?.items ? [...playlist.items] : []
    let position = playlist?.items ? playlist.items.length + 1 : 1
    tracks.forEach((track) => {
      newTrackList.push({ track, position })
      position++
    })

    const collection = {
      id: playlistId,
      type: COLLECTION_TYPE.tracks,
      title: playlist?.title || t('collections.playlists.defaultPlaylistName'),
      items: JSON.stringify(newTrackList),
    }

    if (playlistId) {
      updateCollection(collection as ApiCollectionForUpdate)
    } else {
      createCollection(collection)
    }
  }
}

function useRemoveTracksFromPlaylist() {
  const { data: collections } = useGetCollectionsQuery()
  const [updateCollection] = useUpdateCollectionMutation()

  return (trackPositions: number[], playlistId: string) => {
    // Get collection.
    const playlist = getCollection(
      COLLECTION_TYPE.tracks,
      playlistId,
      collections
    )

    if (!playlist) {
      return
    }

    const newTrackList = [...playlist.items]

    trackPositions.forEach((position) => {
      // Positions start at 1.
      newTrackList.splice(position - 1, 1)
    })

    // Recompute all positions
    const items = newTrackList.map((item, index) => ({
      ...item,
      position: index + 1,
    }))

    const collection = {
      id: playlist.id,
      type: COLLECTION_TYPE.tracks,
      title: playlist.title,
      items: JSON.stringify(items),
    }

    updateCollection(collection)
  }
}
