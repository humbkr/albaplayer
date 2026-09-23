import { gql } from 'graphql-request'
import { request } from 'api/api'
import {
  convertAPIAlbumToAppAlbum,
  convertAPIArtistToAppArtist,
  convertAPITrackToAppTrack,
} from './utils'

type LibraryInitResponse = {
  data: {
    artists?: Artist[]
    albums?: Album[]
    tracks?: Track[]
    variable?: Variable
  }
}

const getLibrary = async (): Promise<LibraryInitResponse | null> => {
  // Query used to initialise the browser with all the data from the server.
  const libraryInit = gql`
    query libraryInit {
      artists {
        id
        name
        dateAdded
      }
      albums {
        id
        title
        year
        artist {
          id
        }
        cover
        dateAdded
      }
      tracks {
        id
        title
        number
        disc
        duration
        artist {
          id
        }
        album {
          id
        }
        cover
        dateAdded
      }
      variable(key: "library_last_updated") {
        value
      }
    }
  `

  const response = await request(libraryInit)

  if (response.data) {
    // Convert API data to app models.
    return {
      data: {
        artists: response.data.artists?.map((item: ApiArtist) =>
          convertAPIArtistToAppArtist(item)
        ),
        albums: response.data.albums?.map((item: ApiAlbum) =>
          convertAPIAlbumToAppAlbum(item)
        ),
        tracks: response.data.tracks?.map((item: ApiTrack) =>
          convertAPITrackToAppTrack(item)
        ),
        variable: {
          key: 'library_last_updated',
          value: response.data.variable?.value || '',
        },
      },
    }
  }

  return null
}

const getFullTrackInfo = (trackId: string) => {
  const fullTrackInfoQuery = gql`
      query fullTrackInfoQuery {
          track(id: ${trackId}) {
              id
              title
              number
              disc
              duration
              src
              cover
              dateAdded
              album {
                  id
                  title
                  year
                  dateAdded
              }
              artist {
                  id
                  name
                  dateAdded
              }
          }
      }
  `

  return request(fullTrackInfoQuery)
}

const scanLibrary = () => {
  const scanLibraryMutation = gql`
    mutation updateLibrary {
      updateLibrary {
        tracksNumber
        albumsNumber
        artistsNumber
      }
    }
  `

  return request(scanLibraryMutation)
}

const getScanProgress = () => {
  const query = gql`
    query {
      scanProgress {
        isUpdating
        filesProcessed
        filesTotal
      }
    }
  `

  return request(query)
}

const emptyLibrary = () => {
  const emptyLibraryMutation = gql`
    mutation eraseLibrary {
      eraseLibrary {
        tracksNumber
        albumsNumber
        artistsNumber
      }
    }
  `

  return request(emptyLibraryMutation)
}

const getLibraryLastUpdated = async (): Promise<string | null> => {
  const query = gql`
    query {
      settings {
        libraryLastUpdated
      }
    }
  `

  const response = await request(query)

  return response.data?.settings?.libraryLastUpdated ?? null
}

export default {
  getLibrary,
  getFullTrackInfo,
  getLibraryLastUpdated,
  scanLibrary,
  getScanProgress,
  emptyLibrary,
}
