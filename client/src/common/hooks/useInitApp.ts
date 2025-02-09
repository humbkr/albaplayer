import { useGetAppConfigQuery } from 'modules/settings/api'
import { useAppDispatch } from 'store/hooks'
import { useEffect } from 'react'
import { useGetUserQuery } from 'modules/user/api'
import { initLibrary } from 'modules/library/store'

export default function useInitApp() {
  const {
    data: appConfig,
    isFetching: isFetchingConfig,
    refetch: refetchAppConfig,
  } = useGetAppConfigQuery()

  const dispatch = useAppDispatch()

  const {
    data: user,
    isLoading: isFetchingUser,
    refetch: refetchUser,
  } = useGetUserQuery(undefined, { skip: appConfig === undefined })

  useEffect(() => {
    if (
      !isFetchingConfig &&
      ((appConfig?.authEnabled && user?.id) || !appConfig?.authEnabled)
    ) {
      dispatch(initLibrary(false))
    }
  }, [appConfig, dispatch, isFetchingConfig, user?.id])

  const onLogin = () => {
    refetchUser()
    dispatch(initLibrary(true))
  }

  const onCreateRootUser = () => {
    refetchAppConfig()
  }

  return {
    isServerReachable: !isFetchingConfig && !!appConfig,
    shouldDisplayLogin: !!(
      appConfig &&
      appConfig.rootUserCreated &&
      appConfig.authEnabled &&
      !user
    ),
    shouldDisplayRootCreation: !!(appConfig && !appConfig.rootUserCreated),
    isLoading: isFetchingConfig || isFetchingUser,
    onLogin,
    onCreateRootUser,
  }
}
