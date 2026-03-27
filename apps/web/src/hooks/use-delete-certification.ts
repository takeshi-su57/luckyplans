import { useMutation } from '@apollo/client/react';
import { graphql } from '@/generated';

const DeleteCertificationMutation = graphql(`
  mutation DeleteCertification($id: String!) {
    deleteCertification(id: $id) {
      success
    }
  }
`);

export function useDeleteCertification() {
  return useMutation(DeleteCertificationMutation, {
    refetchQueries: ['GetPublicProfile'],
  });
}
