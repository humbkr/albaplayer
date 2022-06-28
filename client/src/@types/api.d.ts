export declare global {
  type ApiArtist = {
    id: number
    name: string
    albums?: ApiAlbum[]
    dateAdded?: number
  }

  type ApiAlbum = {
    id: number
    title: string
    year?: string
    artist?: ApiArtist
    cover: string
    tracks: ApiTrack[]
    dateAdded?: number
  }

  type ApiTrack = {
    id: number
    title: string
    src: string
    artist?: ApiArtist
    album?: ApiAlbum
    disc?: string
    number?: number
    duration?: number
    cover?: string
    dateAdded?: number
  }

  type ApiVariable = {
    key?: string
    value: string
  }

  type ApiSettings = {
    libraryPath?: string
    coversPreferredSource?: string
    disableLibrarySettings?: boolean
    version?: string
  }

  type ApiLibraryUpdateState = {
    tracksNumber?: number
    albumsNumber?: number
    artistsNumber?: number
  }
}
