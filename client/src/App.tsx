/* v8 ignore start */

import { Provider as ReduxProvider } from 'react-redux'
import { BrowserRouter } from 'react-router'
import { store } from 'store/store'
import AlbaApp from './AlbaApp'

import 'i18n/i18n'

function App() {
  return (
    <ReduxProvider store={store}>
      <BrowserRouter>
        <AlbaApp />
      </BrowserRouter>
    </ReduxProvider>
  )
}

export default App
