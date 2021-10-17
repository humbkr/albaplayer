import { RootState } from './types'

const rootMigrations = {
  0: (state: RootState) => {
    // Playlist items are now { track: Track, position: number }
    // Playlist.tracks is now Playlist.item
    const convertPlaylist = (playlist: any): Playlist => {
      const migratedPlaylist = {
        ...playlist,
        items: playlist.tracks.map((oldPlaylistItem: any) => {
          const newItem = {
            track: oldPlaylistItem,
            position: oldPlaylistItem.position,
          }
          delete newItem.track.position

          return newItem
        }),
      }
      delete migratedPlaylist.tracks

      return migratedPlaylist
    }

    // Migrate playlists list.
    const migratedPlaylists = Object.fromEntries(
      // Convert to array then iterate through it.
      // fromEntries will give back the object.
      Object.entries(state.playlist.playlists).map(([key, value]) => [
        key,
        convertPlaylist(value),
      ])
    )

    // Migrate current playlist.
    const migratedCurrentPlaylist = convertPlaylist(
      state.playlist.currentPlaylist.playlist
    )

    return {
      ...state,
      playlist: {
        ...state.playlist,
        playlists: migratedPlaylists,
        currentPlaylist: {
          ...state.playlist.currentPlaylist,
          playlist: migratedCurrentPlaylist,
        },
      },
    }
  },
}

export default {
  rootMigrations,
}
