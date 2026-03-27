import { useMutation } from '@apollo/client/react';
import { graphql } from '@/generated';

const ReorderAwardsMutation = graphql(`
  mutation ReorderAwards($input: ReorderInput!) {
    reorderAwards(input: $input) {
      success
    }
  }
`);

export function useReorderAwards() {
  return useMutation(ReorderAwardsMutation, {
    refetchQueries: ['GetPublicProfile'],
  });
}
