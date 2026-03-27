import { useMutation } from '@apollo/client/react';
import { graphql } from '@/generated';

const CreateCertificationMutation = graphql(`
  mutation CreateCertification($input: CreateCertificationInput!) {
    createCertification(input: $input) {
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

export function useCreateCertification() {
  return useMutation(CreateCertificationMutation, {
    refetchQueries: ['GetPublicProfile'],
  });
}
