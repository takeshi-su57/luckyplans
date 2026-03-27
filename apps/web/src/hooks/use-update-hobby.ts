import { useMutation } from '@apollo/client/react';
import { graphql } from '@/generated';

const UpdateHobbyMutation = graphql(`
  mutation UpdateHobby($id: String!, $input: UpdateHobbyInput!) {
    updateHobby(id: $id, input: $input) {
      id
      name
      description
      sortOrder
      createdAt
      updatedAt
    }
  }
`);

export function useUpdateHobby() {
  return useMutation(UpdateHobbyMutation, {
    refetchQueries: ['GetPublicProfile'],
  });
}
