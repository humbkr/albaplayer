import styled, { ThemeProvider, createGlobalStyle } from 'styled-components'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Sidebar from 'common/components/Sidebar'
import MainPanel from 'common/components/MainPanel'
import { initLibrary } from './modules/library/redux'
import MaterialIconsWoff2 from './common/assets/fonts/MaterialIcons-Regular.woff2'
import MaterialIconsWoff from './common/assets/fonts/MaterialIcons-Regular.woff'
import MaterialIconsTtf from './common/assets/fonts/MaterialIcons-Regular.ttf'
import MaterialIconsSvg from './common/assets/fonts/MaterialIcons-Regular.svg'
import getTheme from './themes'
import { RootState } from './store/types'
import { AppTheme } from './themes/types'

function AlbaApp() {
  const currentThemeName = useSelector(
    (state: RootState) => state.settings.theme
  )
  const dispatch = useDispatch()

  const theme = getTheme(currentThemeName)

  useEffect(() => {
    dispatch(initLibrary())
  }, [dispatch])

  return (
    <ThemeProvider theme={theme?.config || null}>
      <AlbaAppWrapper>
        <GlobalStyle />
        <Sidebar />
        <MainPanel />
      </AlbaAppWrapper>
    </ThemeProvider>
  )
}

// Need to use withRouter here or the views in MainPanel won't change.
// https://github.com/ReactTraining/react-router/issues/4671
export default withRouter(AlbaApp)

// Global styles used by the styled components.
const GlobalStyle = createGlobalStyle<{ theme: AppTheme }>`
  @font-face {
  font-family: 'Material Icons';
  font-style: normal;
  font-weight: 400;
  src: local('Material Icons'),
       local('MaterialIcons-Regular'),
       url(${MaterialIconsWoff2}) format('woff2'),
       url(${MaterialIconsWoff}) format('woff'),
       url(${MaterialIconsTtf}) format('truetype');
       url(${MaterialIconsSvg}) format('svg');
  }
  
  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }
  
  *:focus {
    outline: none;
  }
  
  body {
    font-family: sans-serif;
    overflow-x: hidden;
    background-color: ${(props) => props.theme.backgroundColor};
  }
  
  .react-contexify {
    z-index: 50;
  }
`
const AlbaAppWrapper = styled.div`
  display: table;
  width: 100%;
  height: 100vh;
  color: ${(props) => props.theme.textPrimaryColor};
`
