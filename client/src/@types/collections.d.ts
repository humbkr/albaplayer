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
    date: string
    items: PlaylistItem[]
  }
}
