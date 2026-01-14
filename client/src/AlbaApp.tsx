import type { DefaultTheme } from 'styled-components'
import {
  createGlobalStyle,
  StyleSheetManager,
  ThemeProvider,
} from 'styled-components'
import MaterialIconsWoff2 from 'common/assets/fonts/MaterialIcons-Regular.woff2'
import MaterialIconsTtf from 'common/assets/fonts/MaterialIcons-Regular.ttf'
import getTheme from 'themes'
import { useAppSelector } from 'store/hooks'
import { NotificationsContainer } from 'common/utils/notifications'
import isPropValid from '@emotion/is-prop-valid'
import DesktopLayout from 'common/components/layout/Layout'
import MobileLayout from 'common/components/layout/Layout.mobile'
import { isMobileBrowser } from 'common/utils/isMobileBrowser'
import info from '../package.json'
import 'react-contexify/ReactContexify.css'

function AlbaApp() {
  const currentThemeName = useAppSelector((state) => state.settings.theme)
  const theme = getTheme(currentThemeName)
  const isMobile = isMobileBrowser()

  // TODO: check the downside of utilizing the shouldForwardProp function vs transient props
  return (
    <div data-version={info.version}>
      <StyleSheetManager
        shouldForwardProp={(propName, elementToBeRendered) => {
          return typeof elementToBeRendered === 'string'
            ? isPropValid(propName)
            : true
        }}
      >
        <ThemeProvider theme={theme?.config}>
          <GlobalStyle />
          {isMobile ? <MobileLayout /> : <DesktopLayout />}
          <NotificationsContainer />
        </ThemeProvider>
      </StyleSheetManager>
    </div>
  )
}

export default AlbaApp

// Global styles used by the styled components.
const GlobalStyle = createGlobalStyle<{ theme?: DefaultTheme }>`
  @font-face {
    font-family: 'Material Icons';
    font-style: normal;
    font-weight: 400;
    src: local('Material Icons'),
    local('MaterialIcons-Regular'),
    url(${MaterialIconsWoff2}) format('woff2'),
    url(${MaterialIconsTtf}) format('truetype');
  }
  
  html {
    overflow: hidden;
  }

  :root {
    overscroll-behavior: none;
  }

  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    letter-spacing: 0.3px;

    scrollbar-color: ${(props) =>
      props.theme.colors
        .scrollbarColor} ${(props) => props.theme.colors.scrollbarBackground};
    scrollbar-width: thin;
  }

  *:focus {
    outline: none;
  }

  body {
    font-family: sans-serif;
    overflow-x: hidden;
    background-color: ${(props) => props.theme.colors.background};
  }

  @keyframes transition-slide-in-right {
    from {
      transform: translate3d(110%, 0, 0);
      visibility: visible;
    }
    to {
      transform: translate3d(0, 0, 0);
    }
  }

  @keyframes transition-slide-out-right {
    from {
      transform: translate3d(0, 0, 0);
    }
    to {
      visibility: hidden;
      transform: translate3d(110%, 0, 0);
    }
  }

  .notifications-slide-in-right {
    animation: transition-slide-in-right 250ms cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
  }

  .notifications-slide-out-right {
    animation: transition-slide-out-right 250ms cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
  }

  .Toastify__toast-container {
    width: 350px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .Toastify__toast-theme--light {
    background-color: ${(props) => props.theme.colors.background};
    color: ${(props) => props.theme.colors.textPrimary};
    box-shadow: 5px 5px 15px 1px rgba(0, 0, 0, 0.48);
    max-width: 342px;

    &.notifications-info {
      border-left: 4px solid ${(props) => props.theme.colors.info};
    }

    &.notifications-success {
      border-left: 4px solid ${(props) => props.theme.colors.success};
    }

    &.notifications-warning {
      border-left: 4px solid ${(props) => props.theme.colors.warning};
    }

    &.notifications-error {
      border-left: 4px solid ${(props) => props.theme.colors.error};
    }

    .Toastify__close-button--light {
      color: ${(props) => props.theme.colors.textPrimary};
      opacity: 0.5;

      &:hover {
        opacity: 1;
      }
    }

    .Toastify__progress-bar-theme--light {
      visibility: hidden;
    }
  }
`
