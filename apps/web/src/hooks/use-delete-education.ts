import { useMutation } from '@apollo/client/react';
import { graphql } from '@/generated';

const DeleteEducationMutation = graphql(`
  mutation DeleteEducation($id: String!) {
    deleteEducation(id: $id) {
      success
    }
  }
`);

export function useDeleteEducation() {
  return useMutation(DeleteEducationMutation, {
    refetchQueries: ['GetPublicProfile'],
  });
}
