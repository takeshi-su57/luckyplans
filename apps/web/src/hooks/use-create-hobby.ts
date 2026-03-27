import { useMutation } from '@apollo/client/react';
import { graphql } from '@/generated';

const CreateHobbyMutation = graphql(`
  mutation CreateHobby($input: CreateHobbyInput!) {
    createHobby(input: $input) {
      id
      name
      description
      sortOrder
      createdAt
      updatedAt
    }
  }
`);

export function useCreateHobby() {
  return useMutation(CreateHobbyMutation, {
    refetchQueries: ['GetPublicProfile'],
  });
}
