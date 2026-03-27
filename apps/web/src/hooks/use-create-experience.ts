import { useMutation } from '@apollo/client/react';
import { graphql } from '@/generated';

const CreateExperienceMutation = graphql(`
  mutation CreateExperience($input: CreateExperienceInput!) {
    createExperience(input: $input) {
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

export function useCreateExperience() {
  return useMutation(CreateExperienceMutation, {
    refetchQueries: ['GetPublicProfile'],
  });
}
