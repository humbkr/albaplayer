import React, { PropsWithChildren } from 'react'
import { render } from '@testing-library/react'
import type { RenderOptions } from '@testing-library/react'
import { Provider } from 'react-redux'

import { setupStore } from 'store/store'
import themeDefault from 'themes/lightGreen'
import { ThemeProvider } from 'styled-components'

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: DeepPartial<RootReducer>
  store?: AppStore
}

export function renderWithProviders(
  ui: React.ReactElement,
  extendedRenderOptions: ExtendedRenderOptions = {}
) {
  const {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in.
    // @ts-ignore We ignore the deep partial type mismatch because we only want to allow it for tests.
    store = setupStore(preloadedState),
    ...renderOptions
  } = extendedRenderOptions

  function Wrapper({ children }: PropsWithChildren) {
    return (
      <Provider store={store}>
        <ThemeProvider theme={themeDefault}>{children}</ThemeProvider>
      </Provider>
    )
  }

  // Return an object with the store and all of RTL's query functions.
  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  }
}
