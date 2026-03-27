import { useMutation } from '@apollo/client/react';
import { graphql } from '@/generated';

const UpdateExperienceMutation = graphql(`
  mutation UpdateExperience($id: String!, $input: UpdateExperienceInput!) {
    updateExperience(id: $id, input: $input) {
      id
      company
      role
      description
      startDate
      endDate
      sortOrder
      createdAt
      updatedAt
    }
  }
`);

export function useUpdateExperience() {
  return useMutation(UpdateExperienceMutation, {
    refetchQueries: ['GetPublicProfile'],
  });
}
