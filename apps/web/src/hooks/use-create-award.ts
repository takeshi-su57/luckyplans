import { useMutation } from '@apollo/client/react';
import { graphql } from '@/generated';

const CreateAwardMutation = graphql(`
  mutation CreateAward($input: CreateAwardInput!) {
    createAward(input: $input) {
      id
      title
      issuer
      date
      description
      sortOrder
      createdAt
      updatedAt
    }
  }
`);

export function useCreateAward() {
  return useMutation(CreateAwardMutation, {
    refetchQueries: ['GetPublicProfile'],
  });
}
