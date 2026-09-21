import { useTranslation } from 'react-i18next'
import styled, { keyframes } from 'styled-components'
import { Tooltip } from 'react-tooltip'
import Icon from 'common/components/Icon'
import useLibraryUpdateAvailable from 'modules/settings/hooks/useLibraryUpdateAvailable'
import { refreshData } from 'modules/settings/services'

function LibraryUpdateButton() {
  const { t } = useTranslation()
  const { libraryUpdateAvailable } = useLibraryUpdateAvailable()

  if (!libraryUpdateAvailable) {
    return null
  }

  return (
    <Button
      onClick={refreshData}
      data-tooltip-id="library-update-tooltip"
      data-testid="library-update-available-button"
    >
      <PulsingIcon size={20}>refresh</PulsingIcon>
      <Tooltip
        id="library-update-tooltip"
        content={t('settings.libraryUpdateAvailable')}
        place="bottom"
      />
    </Button>
  )
}

export default LibraryUpdateButton

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
  padding: 0 5px;
  cursor: pointer;
  height: 100%;
  transition: background-color 0.15s ease-in-out;

  &:hover {
    background-color: ${(props) => props.theme.colors.background};
  }
`
const PulsingIcon = styled(Icon)`
  animation: ${pulse} 2s ease-in-out infinite;
`
