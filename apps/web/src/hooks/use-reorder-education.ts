import { useMutation } from '@apollo/client/react';
import { graphql } from '@/generated';

const ReorderEducationMutation = graphql(`
  mutation ReorderEducation($input: ReorderInput!) {
    reorderEducation(input: $input) {
      success
    }
  }
`);

export function useReorderEducation() {
  return useMutation(ReorderEducationMutation, {
    refetchQueries: ['GetPublicProfile'],
  });
}
