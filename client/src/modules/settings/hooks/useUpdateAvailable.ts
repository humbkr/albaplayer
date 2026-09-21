import { useGetServerVersionQuery } from 'modules/settings/api'
import info from '../../../../package.json'

const POLLING_INTERVAL = 5 * 60 * 1000

export default function useUpdateAvailable() {
  const { data: serverVersion } = useGetServerVersionQuery(undefined, {
    pollingInterval: POLLING_INTERVAL,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  })

  const updateAvailable =
    !!serverVersion && serverVersion !== 'dev' && serverVersion !== info.version

  return { updateAvailable, latestVersion: serverVersion }
}
