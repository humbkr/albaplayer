import { Provider as ReduxProvider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { ApolloProvider } from '@apollo/client'
import apolloClient from './api/apollo'
import store, { persistor } from './store/store'
import AlbaApp from './AlbaApp'

import 'i18n/i18n'

function App() {
  return (
    <ReduxProvider store={store}>
      <PersistGate persistor={persistor}>
        <ApolloProvider client={apolloClient}>
          <Router>
            <AlbaApp />
          </Router>
        </ApolloProvider>
      </PersistGate>
    </ReduxProvider>
  )
}

export default App
