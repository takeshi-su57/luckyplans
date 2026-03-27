import { useMutation } from '@apollo/client/react';
import { graphql } from '@/generated';

const DeleteAwardMutation = graphql(`
  mutation DeleteAward($id: String!) {
    deleteAward(id: $id) {
      success
    }
  }
`);

export function useDeleteAward() {
  return useMutation(DeleteAwardMutation, {
    refetchQueries: ['GetPublicProfile'],
  });
}
