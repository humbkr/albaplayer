export declare global {
  type SearchFilter = 'all' | 'artist' | 'album' | 'track'

  type ArtistsSortOptions = 'name'

  type AlbumsSortOptions = 'title' | 'year' | 'artistName'

  type TracksSortOptions = 'title' | 'number' | 'album' | 'artistId'

  type BrowserState = {
    artists: Artist[]
    albums: Album[]
    tracks: Track[]
    sortArtists: ArtistsSortOptions
    sortAlbums: AlbumsSortOptions
    sortTracks: TracksSortOptions
    selectedArtists: string
    selectedAlbums: string
    selectedTracks: string
    currentPositionArtists: number
    currentPositionAlbums: number
    currentPositionTracks: number
    search: {
      term: string
      filter: SearchFilter
      // I don't like that but I don't want to rerun the search each time the user selects
      // something after a search.
      filteredArtists: Artist[]
      filteredAlbums: Album[]
      filteredTracks: Track[]
    }
  }
}
