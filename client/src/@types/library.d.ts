export declare global {
  type Artist = {
    id: string
    name: string
    albums?: Array<Album>
    dateAdded?: number
  }

  type Album = {
    id: string
    title: string
    year: string
    artistId?: string
    cover?: string
    artist?: Artist
    tracks?: Array<Track>
    // TODO: Is the following really necessary?
    // Shorthand property for performance.
    artistName?: string
    dateAdded: number
  }

  type Track = {
    id: string
    title: string
    number: number
    disc: string
    // In seconds.
    duration: number
    // Cover url.
    cover: string
    artistId?: string
    albumId?: string
    artist?: Artist
    album?: Album
    src?: string
    dateAdded?: number
  }
}
