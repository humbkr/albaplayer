/* istanbul ignore file */

import constants from 'api/constants'
import i18n from 'i18n/i18n'

export type AuthApiResponse<T> = {
  status: number
  data?: T
  error?: string
}

export async function login(
  username: string,
  password: string
): Promise<AuthApiResponse<User>> {
  const response = await fetch(`${constants.BACKEND_BASE_URL}/auth/login`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })

  return {
    status: response.status,
    data: response.status === 200 ? await response.json() : undefined,
    error:
      response.status === 200
        ? undefined
        : i18n.t('user.login.errors.invalidCredentials'),
  }
}

export async function refreshToken() {
  const response = await fetch(
    `${constants.BACKEND_BASE_URL}/auth/refresh-token`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  return {
    status: response.status,
    data: undefined,
    error:
      response.status === 200
        ? undefined
        : i18n.t('user.login.errors.invalidCredentials'),
  }
}

export async function logout() {
  const response = await fetch(`${constants.BACKEND_BASE_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return {
    status: response.status,
    data: undefined,
    error:
      response.status === 200
        ? undefined
        : i18n.t('user.logout.errors.generic'),
  }
}

export async function createRootUser(
  username: string,
  password: string
): Promise<AuthApiResponse<User>> {
  const response = await fetch(
    `${constants.BACKEND_BASE_URL}/auth/create-root`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    }
  )

  return {
    status: response.status,
    data: undefined,
    error:
      response.status === 200
        ? undefined
        : i18n.t('user.createRoot.errors.generic'),
  }
}
