import { useMutation } from '@apollo/client/react';
import { graphql } from '@/generated';

const CreateSkillMutation = graphql(`
  mutation CreateSkill($input: CreateSkillInput!) {
    createSkill(input: $input) {
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

export function useCreateSkill() {
  return useMutation(CreateSkillMutation, {
    refetchQueries: ['GetPublicProfile'],
  });
}
