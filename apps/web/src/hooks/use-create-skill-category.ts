import { useMutation } from '@apollo/client/react';
import { graphql } from '@/generated';

const CreateSkillCategoryMutation = graphql(`
  mutation CreateSkillCategory($input: CreateSkillCategoryInput!) {
    createSkillCategory(input: $input) {
      id
      name
      sortOrder
      createdAt
      updatedAt
    }
  }
`);

export function useCreateSkillCategory() {
  return useMutation(CreateSkillCategoryMutation, {
    refetchQueries: ['GetSkillCategories', 'GetPublicProfile'],
  });
}
