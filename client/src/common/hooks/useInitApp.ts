import { useGetAppConfigQuery } from 'modules/settings/api'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { useEffect } from 'react'
import { useGetUserQuery } from 'modules/user/store/api'
import { initLibrary } from 'modules/library/store'
import { setLoggedOut } from 'modules/user/store/store'

export default function useInitApp() {
  const {
    data: appConfig,
    isFetching: isFetchingConfig,
    refetch: refetchAppConfig,
  } = useGetAppConfigQuery()

  const dispatch = useAppDispatch()
  const { loggedOut } = useAppSelector((state) => state.user)

  const {
    data: user,
    isLoading: isFetchingUser,
    refetch: refetchUser,
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
      refetchUser()
    }
    dispatch(initLibrary(true))
  }

  const onCreateRootUser = () => {
    refetchAppConfig()
  }

  return {
    shouldDisplayLogin: !!(
      appConfig &&
      appConfig.rootUserCreated &&
      appConfig.authEnabled &&
      !user
    ),
    shouldDisplayRootCreation: !!(appConfig && !appConfig.rootUserCreated),
    isLoading: isFetchingConfig || (!loggedOut && isFetchingUser),
    onLogin,
    onCreateRootUser,
  }
}
