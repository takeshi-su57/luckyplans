import { useMutation } from '@apollo/client/react';
import { graphql } from '@/generated';

const UpdateSkillMutation = graphql(`
  mutation UpdateSkill($id: String!, $input: UpdateSkillInput!) {
    updateSkill(id: $id, input: $input) {
      id
      name
      categoryId
      category {
        id
        name
      }
      proficiency
      sortOrder
      createdAt
      updatedAt
    }
  }
`);

export function useUpdateSkill() {
  return useMutation(UpdateSkillMutation, {
    refetchQueries: ['GetPublicProfile'],
  });
}
