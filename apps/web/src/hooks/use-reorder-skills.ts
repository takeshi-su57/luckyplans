import { useMutation } from '@apollo/client/react';
import { graphql } from '@/generated';

const ReorderSkillsMutation = graphql(`
  mutation ReorderSkills($input: ReorderInput!) {
    reorderSkills(input: $input) {
      success
    }
  }
`);

export function useReorderSkills() {
  return useMutation(ReorderSkillsMutation, {
    refetchQueries: ['GetPublicProfile'],
  });
}
