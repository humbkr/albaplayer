import { renderHook } from '@testing-library/react'
import useInitApp from 'common/hooks/useInitApp'
import { useGetAppConfigQuery } from 'modules/settings/api'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { useGetUserQuery } from 'modules/user/api'
import type { Mock } from 'vitest'

vi.mock('modules/user/store/store')
vi.mock('modules/library/store', () => ({
  initLibrary: vi.fn(),
}))

vi.mock('modules/settings/api', () => ({
  useGetAppConfigQuery: vi.fn(),
}))
const useGetAppConfigQueryMock = useGetAppConfigQuery as Mock

vi.mock('store/hooks')
const useAppSelectorMock = useAppSelector as unknown as Mock
const mockDispatch = vi.fn()
const useAppDispatchMock = useAppDispatch as unknown as Mock

vi.mock('modules/user/api', () => ({
  useGetUserQuery: vi.fn(),
}))
const useGetUserQueryMock = useGetUserQuery as Mock

// TODO: test the rest
describe('HOOK: useInitApp', () => {
  beforeEach(() => {
    useAppDispatchMock.mockReturnValue(mockDispatch)
  })

  it('should return correct values when fetching app config', () => {
    useGetAppConfigQueryMock.mockReturnValue({
      data: null,
      isFetching: true,
      refetch: vi.fn(),
    })
    useAppSelectorMock.mockReturnValue({ loggedOut: false })
    useGetUserQueryMock.mockReturnValue({
      data: null,
      isLoading: false,
      refetch: vi.fn(),
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
      refetch: vi.fn(),
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
      refetch: vi.fn(),
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
      refetch: vi.fn(),
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
      refetch: vi.fn(),
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
    const mockRefetch = vi.fn()
    useGetUserQueryMock.mockReturnValue({
      data: null,
      isLoading: true,
      refetch: mockRefetch,
    })

    const { result } = renderHook(() => useInitApp())
    const { onLogin } = result.current

    onLogin()

    expect(mockDispatch).toHaveBeenCalledTimes(1)
    expect(mockRefetch).toHaveBeenCalledTimes(1)
  })
})
