import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import constants from './constants'

const API_URL = `${constants.BACKEND_BASE_URL}/graphql`

const apolloClient = new ApolloClient({
  link: new HttpLink({ uri: API_URL }),
  cache: new InMemoryCache(),
})

export default apolloClient
