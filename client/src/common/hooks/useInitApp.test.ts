import { renderHook } from '@testing-library/react'
import useInitApp from 'common/hooks/useInitApp'
import { useGetAppConfigQuery } from 'modules/settings/api'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { useGetUserQuery } from 'modules/user/store/api'

jest.mock('modules/user/store/store')
jest.mock('modules/library/store', () => ({
  initLibrary: jest.fn(),
}))

jest.mock('modules/settings/api', () => ({
  useGetAppConfigQuery: jest.fn(),
}))
const useGetAppConfigQueryMock = useGetAppConfigQuery as jest.Mock

jest.mock('store/hooks')
const useAppSelectorMock = useAppSelector as jest.Mock
const mockDispatch = jest.fn()
const useAppDispatchMock = useAppDispatch as jest.Mock

jest.mock('modules/user/store/api', () => ({
  useGetUserQuery: jest.fn(),
}))
const useGetUserQueryMock = useGetUserQuery as jest.Mock

// TODO: test the rest
describe('HOOK: useInitApp', () => {
  beforeEach(() => {
    useAppDispatchMock.mockReturnValue(mockDispatch)
  })

  it('should return correct values when fetching app config', () => {
    useGetAppConfigQueryMock.mockReturnValue({
      data: null,
      isFetching: true,
      refetch: jest.fn(),
    })
    useAppSelectorMock.mockReturnValue({ loggedOut: false })
    useGetUserQueryMock.mockReturnValue({
      data: null,
      isLoading: false,
      refetch: jest.fn(),
    })

    const { result } = renderHook(() => useInitApp())
    const { shouldDisplayLogin, isLoading } = result.current

    expect(shouldDisplayLogin).toBe(false)
    expect(isLoading).toBe(true)
  })

  it('should return correct values when fetching user', () => {
    useGetAppConfigQueryMock.mockReturnValue({
      data: null,
      isFetching: false,
    })
    useAppSelectorMock.mockReturnValue({ loggedOut: false })
    useGetUserQueryMock.mockReturnValue({
      data: null,
      isLoading: true,
      refetch: jest.fn(),
    })

    const { result } = renderHook(() => useInitApp())
    const { shouldDisplayLogin, isLoading } = result.current

    expect(shouldDisplayLogin).toBe(false)
    expect(isLoading).toBe(true)
  })

  it('should return correct values when auth is enabled and user is not logged in', () => {
    useGetAppConfigQueryMock.mockReturnValue({
      data: {
        authEnabled: true,
        rootUserCreated: true,
      },
      isFetching: false,
    })
    useAppSelectorMock.mockReturnValue({ loggedOut: false })
    useGetUserQueryMock.mockReturnValue({
      data: null,
      isLoading: false,
      refetch: jest.fn(),
    })

    const { result } = renderHook(() => useInitApp())
    const { shouldDisplayLogin, isLoading } = result.current

    expect(shouldDisplayLogin).toBe(true)
    expect(isLoading).toBe(false)
  })

  it('should return correct values when auth is enabled and user has been fetched', () => {
    useGetAppConfigQueryMock.mockReturnValue({
      data: { authEnabled: true },
      isFetching: false,
    })
    useAppSelectorMock.mockReturnValue({ loggedOut: false })
    useGetUserQueryMock.mockReturnValue({
      data: { id: '42' },
      isLoading: false,
      refetch: jest.fn(),
    })

    const { result } = renderHook(() => useInitApp())
    const { shouldDisplayLogin, isLoading } = result.current

    expect(shouldDisplayLogin).toBe(false)
    expect(isLoading).toBe(false)
  })

  it('should return correct values when auth is disabled', () => {
    useGetAppConfigQueryMock.mockReturnValue({
      data: {
        authEnabled: false,
        rootUserCreated: true,
      },
      isFetching: false,
    })
    useAppSelectorMock.mockReturnValue({ loggedOut: false })
    useGetUserQueryMock.mockReturnValue({
      data: null,
      isLoading: false,
      refetch: jest.fn(),
    })

    const { result } = renderHook(() => useInitApp())
    const { shouldDisplayLogin, isLoading } = result.current

    expect(shouldDisplayLogin).toBe(false)
    expect(isLoading).toBe(false)
  })

  it('should trigger correct actions when onLogin is called', () => {
    useGetAppConfigQueryMock.mockReturnValue({
      data: { authEnabled: true },
      isFetching: false,
    })
    useAppSelectorMock.mockReturnValue({ loggedOut: false })
    const mockRefetch = jest.fn()
    useGetUserQueryMock.mockReturnValue({
      data: null,
      isLoading: true,
      refetch: mockRefetch,
    })

    const { result } = renderHook(() => useInitApp())
    const { onLogin } = result.current

    onLogin()

    expect(mockDispatch).toHaveBeenCalledTimes(2)
    expect(mockRefetch).toHaveBeenCalledTimes(1)
  })
})
