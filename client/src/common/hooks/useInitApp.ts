import { useGetAppConfigQuery } from 'modules/settings/api'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { useEffect } from 'react'
import { useGetUserQuery } from 'modules/user/store/api'
import { initLibrary } from 'modules/library/store'
import { setLoggedOut } from 'modules/user/store/store'

export default function useInitApp() {
  const { data: appConfig, isFetching: isFetchingConfig } =
    useGetAppConfigQuery()

  const dispatch = useAppDispatch()
  const { loggedOut } = useAppSelector((state) => state.user)

  const {
    data: user,
    isLoading: isFetchingUser,
    refetch,
  } = useGetUserQuery(undefined, { skip: loggedOut || appConfig === undefined })

  useEffect(() => {
    if (
      !isFetchingConfig &&
      ((appConfig?.authEnabled && user?.id) || !appConfig?.authEnabled)
    ) {
      dispatch(initLibrary(false))
    }
  }, [appConfig, dispatch, isFetchingConfig, user?.id])

  const onLogin = () => {
    dispatch(setLoggedOut(false))
    if (isFetchingUser) {
      // Workaround because when clearing rtkQ state after logout, isFetching is true.
      refetch()
    }
    dispatch(initLibrary(true))
  }

  return {
    shouldDisplayLogin: !!appConfig?.authEnabled && !user,
    isLoading: isFetchingConfig || (!loggedOut && isFetchingUser),
    onLogin,
  }
}
