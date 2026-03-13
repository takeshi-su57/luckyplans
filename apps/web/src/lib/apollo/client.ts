import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

const httpLink = new HttpLink({
  uri: '/graphql',
  credentials: 'include',
});

export function createApolloClient() {
  return new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
    dataMasking: false,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
      },
    },
  });
}
