import { useGetServerVersionQuery } from 'modules/settings/api'
import { useAppSelector } from 'store/hooks'

const POLLING_INTERVAL = 5 * 60 * 1000

export default function useLibraryUpdateAvailable() {
  const { data, refetch } = useGetServerVersionQuery(undefined, {
    pollingInterval: POLLING_INTERVAL,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  })
  const serverLastUpdated = data?.libraryLastUpdated

  const localLastScan = useAppSelector((state) => state.library.lastScan)
  const isUpdating = useAppSelector(
    (state) => state.settings.library.isUpdating
  )

  const libraryUpdateAvailable =
    !isUpdating &&
    !!serverLastUpdated &&
    !!localLastScan &&
    serverLastUpdated !== localLastScan

  return { libraryUpdateAvailable, refetchServerLastUpdated: refetch }
}
