import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query'
import constants from 'api/constants'
import { ClientError, gql, GraphQLClient } from 'graphql-request'
import { refreshToken } from 'modules/user/authApi'
import { logoutUser } from 'modules/user/utils'
import { processApiError } from './helpers'

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

/**
 * Tries fetching an image from the backend. If the user is not authenticated,
 * it will try to get a new token and retry the request.
 *
 * @param url The URL of the image to fetch.
 *
 * @returns The URL of the image to display.
 */
export async function getAuthAssetURL(url: string): Promise<string> {
  const uri = `${constants.BACKEND_BASE_URL}${url}`

  const response = await fetch(uri, { credentials: 'include' })

  if (!response.ok && response.status === 401) {
    // Try to get a new token.
    const refreshResult = await refreshToken()
    if (!refreshResult.error) {
      // Let the browser retry the request.
      return uri
    } else {
      await logoutUser()
    }
  }

  // We already have the image data, so we can directly use it without a second request.
  const imageBlob = await response.blob()
  return URL.createObjectURL(imageBlob)
}

export default {
  getSettings,
  processApiError,
}
