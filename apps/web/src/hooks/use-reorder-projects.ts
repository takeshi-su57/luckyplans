import { useMutation } from '@apollo/client/react';
import { graphql } from '@/generated';

const ReorderProjectsMutation = graphql(`
  mutation ReorderProjects($input: ReorderInput!) {
    reorderProjects(input: $input) {
      success
    }
  }
`);

export function useReorderProjects() {
  return useMutation(ReorderProjectsMutation, {
    refetchQueries: ['GetPublicProfile'],
  });
}
