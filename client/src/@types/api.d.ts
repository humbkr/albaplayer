export declare global {
  /* Library API */

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

  /* Collections API */

  type ApiCollection = {
    id: string
    type: string
    title: string
    items: string
    dateAdded: number
    dateModified: number
  }

  type ApiCollectionForCreation = Omit<
    ApiCollection,
    'id' | 'dateAdded' | 'dateModified'
  >
  type ApiCollectionForUpdate = Omit<
    ApiCollection,
    'dateAdded' | 'dateModified'
  >

  type GetCollectionsResponse = {
    collections: ApiCollection[]
  }

  type GetCollectionResponse = {
    collection: ApiCollection
  }

  /* Variables API */

  type ApiVariable = {
    key?: string
    value: string
  }

  /* Settings API */

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
