import { useMutation } from '@apollo/client/react';
import { graphql } from '@/generated';

const CreateEducationMutation = graphql(`
  mutation CreateEducation($input: CreateEducationInput!) {
    createEducation(input: $input) {
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

export function useCreateEducation() {
  return useMutation(CreateEducationMutation, {
    refetchQueries: ['GetPublicProfile'],
  });
}
