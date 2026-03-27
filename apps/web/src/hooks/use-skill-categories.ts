import { useQuery } from '@apollo/client/react';
import { graphql } from '@/generated';

const GetSkillCategoriesQuery = graphql(`
  query GetSkillCategories {
    getSkillCategories {
      id
      name
      sortOrder
      createdAt
      updatedAt
    }
  }
`);

export function useSkillCategories() {
  return useQuery(GetSkillCategoriesQuery);
}
