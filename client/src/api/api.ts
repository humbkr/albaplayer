import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query'
import constants from 'api/constants'
import { ClientError, gql, GraphQLClient } from 'graphql-request'
import { refreshToken } from 'modules/user/authApi'
import { logoutUser } from 'modules/user/utils'
import {
  convertAPIAlbumToAppAlbum,
  convertAPIArtistToAppArtist,
  convertAPITrackToAppTrack,
} from './helpers'

type LibraryInitResponse = {
  data: {
    artists?: Artist[]
    albums?: Album[]
    tracks?: Track[]
    variable?: Variable
  }
}

export type GraphQLApiResponse = {
  status: number
  data?: any
  error?: string
}

// Direct client.
const graphQLClient = new GraphQLClient(
  `${constants.BACKEND_BASE_URL}/graphql`,
  { credentials: 'include' }
)

export async function request(
  query: string,
  variables?: { [key: string]: string }
): Promise<GraphQLApiResponse> {
  const response = {
    status: 200,
    data: undefined,
    error: '',
  }

  try {
    response.data = await graphQLClient.request(query, variables)
  } catch (error: any) {
    if (error.response.status === 401) {
      // Try to get a new token.
      const refreshResult = await refreshToken()
      if (!refreshResult.error) {
        // New token has been stored, retry the initial query.
        // @ts-ignore
        response.data = await graphQLClient.request(query, variables)
      } else {
        response.status = refreshResult.status
        response.error = refreshResult.error
        await logoutUser()
      }
    } else {
      response.status = error.response.status
      response.error = JSON.stringify(error, undefined, 2)
    }
  }

  return response
}

// Client for RTK Queries
const baseQuery = graphqlRequestBaseQuery<
  Partial<ClientError> & { errorCode: string }
>({
  client: graphQLClient,
  customErrors: ({ name, stack, response }) => {
    if (!response?.status.toString().startsWith('2')) {
      // This is a server error, not a GraphQL error.
      return {
        name: 'Request or server error',
        message: response.error,
        errorCode: response.status.toString(),
        stack,
      }
    }

    if (response?.errors?.length) {
      const error = response.errors[0]

      return {
        name,
        message: error.message,
        errorCode: (error.extensions?.code as string) || 'unknown_error',
        stack,
      }
    }

    return {
      name: name,
      message: 'Unknown error',
      errorCode: 'unknown_error',
      stack,
    }
  },
})

const baseQueryWithReauth: (...args: any[]) => Promise<any> = async (
  ...args: any[]
) => {
  // @ts-ignore
  let result = await baseQuery(...args)

  if (result.error && result.error.errorCode === '401') {
    // Try to get a new token.
    const refreshResult = await refreshToken()
    if (!refreshResult.error) {
      // New token has been stored, retry the initial query.
      // @ts-ignore
      result = await baseQuery(...args)
    } else {
      await logoutUser()
    }
  }

  return result
}

export const graphqlAPI = createApi({
  reducerPath: 'graphqlApi',
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  tagTypes: ['Auth'],
})

export const restAPI = createApi({
  reducerPath: 'restApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${constants.BACKEND_BASE_URL}`,
  }),
  endpoints: () => ({}),
})

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

  return graphQLClient.request(scanLibraryMutation)
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

  return request(getSettingsQuery)
}

const getVariable = (key: string) => {
  const getVariableQuery = gql`
    query {
      variable(key: "${key}") {
        value
      }
    }
  `

  return request(getVariableQuery)
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
