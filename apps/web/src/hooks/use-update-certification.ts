import { useMutation } from '@apollo/client/react';
import { graphql } from '@/generated';

const UpdateCertificationMutation = graphql(`
  mutation UpdateCertification($id: String!, $input: UpdateCertificationInput!) {
    updateCertification(id: $id, input: $input) {
      id
      name
      issuer
      issueDate
      expiryDate
      url
      sortOrder
      createdAt
      updatedAt
    }
  }
`);

export function useUpdateCertification() {
  return useMutation(UpdateCertificationMutation, {
    refetchQueries: ['GetPublicProfile'],
  });
}
