import gql from 'graphql-tag'
import { ApolloQueryResult } from 'apollo-client/core/types'
import apolloClient from './apollo'
import {
  convertAPIAlbumToAppAlbum,
  convertAPIArtistToAppArtist,
  convertAPITrackToAppTrack,
} from './helpers'

type ApiLibraryInitResult = {
  artists?: ApiArtist[]
  albums?: ApiAlbum[]
  tracks?: ApiTrack[]
  variable?: ApiVariable
}

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

  const response: ApolloQueryResult<ApiLibraryInitResult> = await apolloClient.query(
    { query: libraryInit }
  )

  if (response.data) {
    // Convert API data to app models.
    return {
      data: {
        artists: response.data.artists?.map(
          (item) => convertAPIArtistToAppArtist(item) as Artist
        ),
        albums: response.data.albums?.map(
          (item) => convertAPIAlbumToAppAlbum(item) as Album
        ),
        tracks: response.data.tracks?.map(
          (item) => convertAPITrackToAppTrack(item) as Track
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

  return apolloClient.query({ query: fullTrackInfoQuery })
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

  return apolloClient.mutate({ mutation: scanLibraryMutation })
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

  return apolloClient.mutate({ mutation: emptyLibraryMutation })
}

const getSettings = () => {
  const getSettingsQuery = gql`
    query getSettingsQuery {
      settings {
        libraryPath
        coversPreferredSource
        disableLibrarySettings
        version
      }
    }
  `

  return apolloClient.query({ query: getSettingsQuery })
}

const getVariable = (key: string) => {
  const getVariableQuery = gql`
    query {
      variable(key: "${key}") {
        value
      }
    }
  `

  return apolloClient.query({ query: getVariableQuery })
}

const processApiError = (response: any): string => {
  let result = 'Unknown error'
  if (response.graphQLErrors.length > 0 && response.graphQLErrors[0].message) {
    result = response.graphQLErrors[0].message
  } else if (response.message) {
    result = response.message
  }

  return result
}

export default {
  getLibrary,
  getFullTrackInfo,
  scanLibrary,
  emptyLibrary,
  getSettings,
  getVariable,
  processApiError,
}
