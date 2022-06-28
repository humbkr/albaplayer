import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { render } from '@testing-library/react'
import { Provider as ReduxProvider } from 'react-redux'
import { ThemeProvider } from 'styled-components'
import { makeMockStore } from '../../../../__tests__/test-utils/redux'
import themeDefault from '../../../themes/default'
import Dashboard from '../scenes/Dashboard'
import { dashboardInitialState } from '../store'
import { libraryInitialState } from '../../library/store'
import { playlistsInitialState } from '../../playlist/store'

const store = makeMockStore({
  library: libraryInitialState,
  playlist: playlistsInitialState,
  dashboard: dashboardInitialState,
})

describe('dashboard - Dashboard scene', () => {
  it('should render without error', () => {
    render(
      <ReduxProvider store={store}>
        <ThemeProvider theme={themeDefault}>
          <BrowserRouter>
            <Dashboard />
          </BrowserRouter>
        </ThemeProvider>
      </ReduxProvider>
    )
  })
})
