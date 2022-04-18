export declare global {
  type Artist = {
    id: string
    name: string
    albums?: Album[]
    dateAdded?: number
  }

  type Album = {
    id: string
    title: string
    year: string
    artistId?: string
    cover?: string
    artist?: Artist
    tracks?: Track[]
    dateAdded: number
  }

  type Track = {
    id: string
    title: string
    src: string
    // In seconds.
    duration?: number
    number?: number
    disc?: string
    // Cover url.
    cover?: string
    artistId?: string
    albumId?: string
    artist?: Artist
    album?: Album
    dateAdded?: number
  }
}
