import { useMutation } from '@apollo/client/react';
import { graphql } from '@/generated';

const DeleteHobbyMutation = graphql(`
  mutation DeleteHobby($id: String!) {
    deleteHobby(id: $id) {
      success
    }
  }
`);

export function useDeleteHobby() {
  return useMutation(DeleteHobbyMutation, {
    refetchQueries: ['GetPublicProfile'],
  });
}
