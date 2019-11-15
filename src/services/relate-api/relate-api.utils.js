import { split } from 'apollo-link'
import { createHttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { setContext } from 'apollo-link-context'
import ApolloClient from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { getMainDefinition } from 'apollo-utilities'
import { onError } from 'apollo-link-error'

export const createClient = (apiEndpoint, apiClientId = null) => {
  const apiEndpointUrl = new URL(apiEndpoint)
  const apiEndpointNoScheme = `${apiEndpointUrl.host}${
    apiEndpointUrl.pathname ? apiEndpointUrl.pathname : ''
  }`

  const httpLink = createHttpLink({
    uri: apiEndpoint
  })

  const wsLink = new WebSocketLink({
    uri: `ws://${apiEndpointNoScheme}`,
    options: {
      reconnect: true,
      connectionParams: {
        ClientId: apiClientId
      }
    }
  })

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        ClientId: apiClientId
      }
    }
  })

  const link = split(
    // split based on operation type
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query)
      return kind === 'OperationDefinition' && operation === 'subscription'
    },
    wsLink,
    authLink.concat(httpLink)
  )

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) =>
        console.log(
          `Relate API GraphQL error: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      )
    }

    if (networkError) {
      console.log(`Relate API Network error: ${networkError}`)
    }
  })

  const client = new ApolloClient({
    link: errorLink.concat(link),
    cache: new InMemoryCache()
  })

  return client
}
