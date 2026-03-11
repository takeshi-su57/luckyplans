import { useQuery } from '@apollo/client/react';
import { graphql } from '@/generated';

const GetItemQuery = graphql(`
  query GetItem($id: String!) {
    getItem(id: $id) {
      id
      name
      description
      createdAt
    }
  }
`);

export function useItem(id: string) {
  return useQuery(GetItemQuery, { variables: { id } });
}
