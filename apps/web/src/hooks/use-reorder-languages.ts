import { useMutation } from '@apollo/client/react';
import { graphql } from '@/generated';

const ReorderLanguagesMutation = graphql(`
  mutation ReorderLanguages($input: ReorderInput!) {
    reorderLanguages(input: $input) {
      success
    }
  }
`);

export function useReorderLanguages() {
  return useMutation(ReorderLanguagesMutation, {
    refetchQueries: ['GetPublicProfile'],
  });
}
