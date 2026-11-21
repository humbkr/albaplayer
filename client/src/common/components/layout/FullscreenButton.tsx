import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { Tooltip } from 'react-tooltip'
import Icon from 'common/components/Icon'
import { useFullscreen } from 'common/utils/useFullscreen'
import { isIOS } from 'common/utils/isIOS'

function FullscreenButton() {
  const { t } = useTranslation()
  const { isSupported, isFullscreen, toggleFullscreen } = useFullscreen()

  // IOS exits fullscreen on any swipe down, which makes it unusable.
  if (!isSupported || isIOS()) {
    return null
  }

  const label = isFullscreen
    ? t('common.exitFullscreen')
    : t('common.fullscreen')

  return (
    <Button
      onClick={toggleFullscreen}
      aria-label={label}
      data-tooltip-id="fullscreen-tooltip"
      data-testid="fullscreen-button"
    >
      <Icon size={20}>{isFullscreen ? 'fullscreen_exit' : 'fullscreen'}</Icon>
      <Tooltip
        id="fullscreen-tooltip"
        content={label}
        place="bottom"
        style={{ fontSize: '1rem' }}
      />
    </Button>
  )
}

export default FullscreenButton

const Button = styled.button`
  background-color: transparent;
  color: ${(props) => props.theme.colors.sidebarTextPrimary};
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
