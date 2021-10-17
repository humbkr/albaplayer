import ApolloClient from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import constants from './constants'

const API_URL = `${constants.BACKEND_BASE_URL}/graphql`

const apolloClient = new ApolloClient({
  link: new HttpLink({ uri: API_URL }),
  cache: new InMemoryCache(),
})

export default apolloClient
