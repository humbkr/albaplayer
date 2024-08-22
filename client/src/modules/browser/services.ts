import { useAppDispatch, useAppSelector } from 'store/hooks'
import {
  addAlbums,
  addArtists,
  addTracks,
  playAlbums,
  playAlbumsAfterCurrent,
  playArtists,
  playArtistsAfterCurrent,
  playTracks,
  playTracksAfterCurrent,
} from 'modules/player/store/store'

function useGetTrackIds() {
  const currentTracks = useAppSelector((state) => state.libraryBrowser.tracks)

  return (trackId: string) => {
    let trackIds = []
    if (trackId === '0') {
      const tracksArray = Object.values(currentTracks) as Track[]
      trackIds = tracksArray.map((track: Track) => track.id)
    } else {
      trackIds = [trackId]
    }

    return trackIds
  }
}

export function usePlayTrack() {
  const getTrackIds = useGetTrackIds()
  const dispatch = useAppDispatch()

  return (trackId: string) => {
    dispatch(playTracks(getTrackIds(trackId)))
  }
}

export function usePlayTrackAfterCurrent() {
  const getTrackIds = useGetTrackIds()
  const dispatch = useAppDispatch()

  return (trackId: string) => {
    dispatch(playTracksAfterCurrent(getTrackIds(trackId)))
  }
}

export function useAddTrack() {
  const getTrackIds = useGetTrackIds()
  const dispatch = useAppDispatch()

  return (trackId: string) => {
    dispatch(addTracks(getTrackIds(trackId)))
  }
}

function useGetAlbumIds() {
  const currentAlbums = useAppSelector((state) => state.libraryBrowser.albums)

  return (albumId: string) => {
    let albumsIds = []
    if (albumId === '0') {
      const tracksArray = Object.values(currentAlbums) as Album[]
      albumsIds = tracksArray.map((album: Album) => album.id)
    } else {
      albumsIds = [albumId]
    }

    return albumsIds
  }
}

export function usePlayAlbum() {
  const getAlbumIds = useGetAlbumIds()
  const dispatch = useAppDispatch()

  return (albumId: string) => {
    dispatch(playAlbums(getAlbumIds(albumId)))
  }
}

export function usePlayAlbumAfterCurrent() {
  const getAlbumIds = useGetAlbumIds()
  const dispatch = useAppDispatch()

  return (albumId: string) => {
    dispatch(playAlbumsAfterCurrent(getAlbumIds(albumId)))
  }
}

export function useAddAlbum() {
  const getAlbumIds = useGetAlbumIds()
  const dispatch = useAppDispatch()

  return (albumId: string) => {
    dispatch(addAlbums(getAlbumIds(albumId)))
  }
}

function useGetArtistIds() {
  const currentArtists = useAppSelector((state) => state.libraryBrowser.artists)

  return (albumId: string) => {
    let artistsIds = []
    if (albumId === '0') {
      const tracksArray = Object.values(currentArtists) as Album[]
      artistsIds = tracksArray.map((album: Album) => album.id)
    } else {
      artistsIds = [albumId]
    }

    return artistsIds
  }
}

export function usePlayArtist() {
  const getArtistIds = useGetArtistIds()
  const dispatch = useAppDispatch()

  return (artistId: string) => {
    dispatch(playArtists(getArtistIds(artistId)))
  }
}

export function usePlayArtistAfterCurrent() {
  const getArtistIds = useGetArtistIds()
  const dispatch = useAppDispatch()

  return (artistId: string) => {
    dispatch(playArtistsAfterCurrent(getArtistIds(artistId)))
  }
}

export function useAddArtist() {
  const getArtistIds = useGetArtistIds()
  const dispatch = useAppDispatch()

  return (artistId: string) => {
    dispatch(addArtists(getArtistIds(artistId)))
  }
}
