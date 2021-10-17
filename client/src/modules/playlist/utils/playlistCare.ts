import { LibraryStateType } from '../../library/redux'

/**
 * Given a track, tries to find the most similar tracks in the library based on track title, album
 * title, and artist name.
 *
 * This function is useful to fix de-synchronised playlists, ie playlists containing songs that have
 * changed id since they were added to that playlist (after a library reset for example).
 *
 * @param track Track
 *   The track to find similar tracks to.
 * @param library LibraryStateType
 *   Library state.
 *
 * @return Track[]
 *   Tracks that matched the original track data.
 */
// eslint-disable-next-line import/prefer-default-export
export const findSimilarTracks = (
  track: Track,
  library: LibraryStateType
): Track[] => {
  const trackNameMatches: Track[] = Object.values(library.tracks).filter(
    (item: Track) => item.title.toLowerCase() === track.title.toLowerCase()
  )

  if (trackNameMatches.length === 0) {
    return []
  }

  if (trackNameMatches.length === 1) {
    // We found a unique match, no need to search more.
    return [
      {
        ...trackNameMatches[0],
        album: trackNameMatches[0].albumId
          ? library.albums[trackNameMatches[0].albumId]
          : undefined,
        artist: trackNameMatches[0].artistId
          ? library.artists[trackNameMatches[0].artistId]
          : undefined,
      },
    ]
  }

  // Else we will try to filter again by album name.
  const trackNameAndAlbumNameMatch = trackNameMatches.filter(
    (item: Track) => item.albumId
      && library.albums[item.albumId].title.toLowerCase()
        === track.album?.title.toLowerCase()
  )

  if (trackNameAndAlbumNameMatch.length === 1) {
    // We found a unique match, no need to search more.
    return [
      {
        ...trackNameAndAlbumNameMatch[0],
        album: trackNameAndAlbumNameMatch[0].albumId
          ? library.albums[trackNameAndAlbumNameMatch[0].albumId]
          : undefined,
        artist: trackNameAndAlbumNameMatch[0].artistId
          ? library.artists[trackNameAndAlbumNameMatch[0].artistId]
          : undefined,
      },
    ]
  }

  // Else we will try to filter again by artist name.
  const trackNameAndAlbumNameAndArtistNameMatch = trackNameAndAlbumNameMatch.filter(
    (item: Track) => item.artistId
      && library.artists[item.artistId].name.toLowerCase()
        === track.artist?.name.toLowerCase()
  )

  if (trackNameAndAlbumNameAndArtistNameMatch.length === 1) {
    // We found a unique match, return it.
    return [
      {
        ...trackNameAndAlbumNameAndArtistNameMatch[0],
        album: trackNameAndAlbumNameAndArtistNameMatch[0].albumId
          ? library.albums[trackNameAndAlbumNameAndArtistNameMatch[0].albumId]
          : undefined,
        artist: trackNameAndAlbumNameAndArtistNameMatch[0].artistId
          ? library.artists[trackNameAndAlbumNameAndArtistNameMatch[0].artistId]
          : undefined,
      },
    ]
  }

  // TODO: we could compare other metadata to differentiate but this use case is very unlikely.

  // Else we are very unlucky, return the most filtered list possible.
  if (trackNameAndAlbumNameAndArtistNameMatch.length > 1) {
    return trackNameAndAlbumNameAndArtistNameMatch
  }
  if (trackNameAndAlbumNameMatch.length > 1) {
    return trackNameAndAlbumNameMatch
  }

  return trackNameMatches
}
