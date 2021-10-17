import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { ApolloProvider } from 'react-apollo'
import { BrowserRouter as Router } from 'react-router-dom'
import { PersistGate } from 'redux-persist/lib/integration/react'
import apolloClient from './api/apollo'
import store, { persistor } from './store/store'
import AlbaApp from './AlbaApp'

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
