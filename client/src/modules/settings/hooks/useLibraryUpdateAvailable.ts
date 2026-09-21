import { useGetLibraryLastUpdatedQuery } from 'modules/settings/api'
import { useAppSelector } from 'store/hooks'

const POLLING_INTERVAL = 5 * 60 * 1000

export default function useLibraryUpdateAvailable() {
  const { data: serverLastUpdated } = useGetLibraryLastUpdatedQuery(undefined, {
    pollingInterval: POLLING_INTERVAL,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  })

  const localLastScan = useAppSelector((state) => state.library.lastScan)

  const libraryUpdateAvailable =
    !!serverLastUpdated &&
    !!localLastScan &&
    serverLastUpdated !== localLastScan

  return { libraryUpdateAvailable }
}
