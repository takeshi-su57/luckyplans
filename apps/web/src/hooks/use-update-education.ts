import { useMutation } from '@apollo/client/react';
import { graphql } from '@/generated';

const UpdateEducationMutation = graphql(`
  mutation UpdateEducation($id: String!, $input: UpdateEducationInput!) {
    updateEducation(id: $id, input: $input) {
      id
      school
      degree
      field
      startDate
      endDate
      description
      sortOrder
      createdAt
      updatedAt
    }
  }
`);

export function useUpdateEducation() {
  return useMutation(UpdateEducationMutation, {
    refetchQueries: ['GetPublicProfile'],
  });
}
