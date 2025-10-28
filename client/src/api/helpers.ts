import constants from 'api/constants'
import { refreshToken } from 'modules/user/authApi'
import { logoutUser } from 'modules/user/services'

export const processApiError = (response: any): string => {
  let result = 'Unknown error'
  if (response.graphQLErrors.length > 0 && response.graphQLErrors[0].message) {
    result = response.graphQLErrors[0].message
  } else if (response.message) {
    result = response.message
  }

  return result
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
