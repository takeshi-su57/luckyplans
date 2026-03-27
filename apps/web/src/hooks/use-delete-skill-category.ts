import { useMutation } from '@apollo/client/react';
import { graphql } from '@/generated';

const DeleteSkillCategoryMutation = graphql(`
  mutation DeleteSkillCategory($id: String!) {
    deleteSkillCategory(id: $id) {
      success
    }
  }
`);

export function useDeleteSkillCategory() {
  return useMutation(DeleteSkillCategoryMutation, {
    refetchQueries: ['GetSkillCategories', 'GetPublicProfile'],
  });
}
