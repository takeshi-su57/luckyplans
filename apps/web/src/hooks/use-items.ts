import { useQuery } from '@apollo/client/react';
import { graphql } from '@/generated';

const GetItemsQuery = graphql(`
  query GetItems($page: Float = 1, $limit: Float = 10) {
    getItems(page: $page, limit: $limit) {
      items {
        id
        name
        description
        createdAt
      }
      total
    }
  }
`);

export function useItems(variables?: { page?: number; limit?: number }) {
  return useQuery(GetItemsQuery, { variables });
}
