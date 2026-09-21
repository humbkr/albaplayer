import { useTranslation } from 'react-i18next'
import styled, { keyframes } from 'styled-components'
import { Tooltip } from 'react-tooltip'
import Icon from 'common/components/Icon'
import useUpdateAvailable from 'modules/settings/hooks/useUpdateAvailable'

async function clearCachesAndReload() {
  if ('caches' in window) {
    const cacheNames = await caches.keys()
    await Promise.all(cacheNames.map((name) => caches.delete(name)))
  }

  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations()
    await Promise.all(registrations.map((reg) => reg.unregister()))
  }

  window.location.reload()
}

function AppUpdateButton() {
  const { t } = useTranslation()
  const { updateAvailable } = useUpdateAvailable()

  if (!updateAvailable) {
    return null
  }

  return (
    <Button
      onClick={clearCachesAndReload}
      data-tooltip-id="update-tooltip"
      data-testid="update-available-button"
    >
      <PulsingIcon size={20}>update</PulsingIcon>
      <Tooltip
        id="update-tooltip"
        content={t('settings.updateAvailable')}
        place="bottom"
      />
    </Button>
  )
}

export default AppUpdateButton

const pulse = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
`

const Button = styled.button`
  background-color: transparent;
  color: ${(props) => props.theme.colors.info};
  border: 0;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
  cursor: pointer;
  height: 100%;
  aspect-ratio: 1;
  transition: background-color 0.15s ease-in-out;

  &:hover {
    background-color: ${(props) => props.theme.colors.background};
  }
`
const PulsingIcon = styled(Icon)`
  animation: ${pulse} 2s ease-in-out infinite;
`
