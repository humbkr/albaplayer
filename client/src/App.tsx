/* v8 ignore start */

import { Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { BrowserRouter } from 'react-router'
import { store, persistor } from 'store/store'
import AlbaApp from './AlbaApp'

import 'i18n/i18n'

function App() {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <AlbaApp />
        </BrowserRouter>
      </PersistGate>
    </ReduxProvider>
  )
}

export default App
