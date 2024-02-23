export declare global {
  type PlaylistItem = {
    track: Track
    position: number
  }

  type PlaylistCareItem = PlaylistItem & {
    similarTracks: Track[]
    processed?: boolean
  }

  type Playlist = {
    id: string
    title: string
    dateCreated: number
    dateModified: number
    items: PlaylistItem[]
  }

  type Collections = {
    playlists: Playlist[]
  }
}
