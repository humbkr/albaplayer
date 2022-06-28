export const convertAPIArtistToAppArtist = (
  apiArtist?: ApiArtist
): Artist | undefined => {
  if (!apiArtist) {
    return undefined
  }

  return {
    id: apiArtist.id.toString(10),
    name: apiArtist.name,
    albums:
      apiArtist.albums?.map(
        (item) => convertAPIAlbumToAppAlbum(item) as Album
      ) || undefined,
    dateAdded: apiArtist.dateAdded,
  }
}

export const convertAPIAlbumToAppAlbum = (
  apiAlbum?: ApiAlbum
): Album | undefined => {
  if (!apiAlbum) {
    return undefined
  }

  return {
    id: apiAlbum.id.toString(10),
    title: apiAlbum.title,
    year: apiAlbum.year || '',
    cover: apiAlbum.cover,
    artistId: apiAlbum.artist?.id.toString(10) || '0',
    artist: convertAPIArtistToAppArtist(apiAlbum.artist),
    dateAdded: apiAlbum.dateAdded || 0,
    tracks:
      apiAlbum.tracks?.map(
        (item) => convertAPITrackToAppTrack(item) as Track
      ) || undefined,
  }
}

export const convertAPITrackToAppTrack = (
  apiTrack?: ApiTrack
): Track | undefined => {
  if (!apiTrack) {
    return undefined
  }

  return {
    id: apiTrack.id.toString(10),
    title: apiTrack.title,
    src: apiTrack.src,
    number: apiTrack.number,
    duration: apiTrack.duration,
    disc: apiTrack.disc,
    cover: apiTrack.cover,
    dateAdded: apiTrack.dateAdded,
    artistId: apiTrack.artist?.id.toString(10) || '0',
    albumId: apiTrack.album?.id.toString(10) || '0',
    artist: convertAPIArtistToAppArtist(apiTrack.artist),
    album: convertAPIAlbumToAppAlbum(apiTrack.album),
  }
}
