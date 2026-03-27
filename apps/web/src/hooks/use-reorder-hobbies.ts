import { useMutation } from '@apollo/client/react';
import { graphql } from '@/generated';

const ReorderHobbiesMutation = graphql(`
  mutation ReorderHobbies($input: ReorderInput!) {
    reorderHobbies(input: $input) {
      success
    }
  }
`);

export function useReorderHobbies() {
  return useMutation(ReorderHobbiesMutation, {
    refetchQueries: ['GetPublicProfile'],
  });
}
