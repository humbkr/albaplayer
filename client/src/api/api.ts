import gql from 'graphql-tag'
import apolloClient from './apollo'

const getLibrary = () => {
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
        artistId
        cover
        dateAdded
      }
      tracks {
        id
        title
        number
        disc
        duration
        artistId
        albumId
        cover
        dateAdded
      }
      variable(key: "library_last_updated") {
        value
      }
    }
  `

  return apolloClient.query({ query: libraryInit })
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
  // TODO not sure we should use a query here, but apollo doesn't allow a mutation without parameter
  const scanLibraryQuery = gql`
    query scanLibraryQuery {
      updateLibrary {
        tracksNumber
      }
    }
  `

  return apolloClient.query({ query: scanLibraryQuery })
}

const emptyLibrary = () => {
  // TODO not sure we should use a query here, but apollo doesn't allow a mutation without parameter
  const emptyLibraryQuery = gql`
    query emptyLibraryQuery {
      eraseLibrary {
        tracksNumber
      }
    }
  `

  return apolloClient.query({ query: emptyLibraryQuery })
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
