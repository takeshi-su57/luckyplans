import { useMutation } from '@apollo/client/react';
import { graphql } from '@/generated';

const DeleteSkillMutation = graphql(`
  mutation DeleteSkill($id: String!) {
    deleteSkill(id: $id) {
      success
    }
  }
`);

export function useDeleteSkill() {
  return useMutation(DeleteSkillMutation, {
    refetchQueries: ['GetPublicProfile'],
  });
}
