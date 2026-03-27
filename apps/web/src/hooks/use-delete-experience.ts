import { useMutation } from '@apollo/client/react';
import { graphql } from '@/generated';

const DeleteExperienceMutation = graphql(`
  mutation DeleteExperience($id: String!) {
    deleteExperience(id: $id) {
      success
    }
  }
`);

export function useDeleteExperience() {
  return useMutation(DeleteExperienceMutation, {
    refetchQueries: ['GetPublicProfile'],
  });
}
