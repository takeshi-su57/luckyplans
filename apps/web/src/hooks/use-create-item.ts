import { useMutation } from '@apollo/client/react';
import { graphql } from '@/generated';

const CreateItemMutation = graphql(`
  mutation CreateItem($name: String!, $description: String) {
    createItem(name: $name, description: $description) {
      id
      name
      description
      createdAt
    }
  }
`);

export function useCreateItem() {
  return useMutation(CreateItemMutation, {
    refetchQueries: ['GetItems'],
  });
}
