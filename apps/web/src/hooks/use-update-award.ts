import { useMutation } from '@apollo/client/react';
import { graphql } from '@/generated';

const UpdateAwardMutation = graphql(`
  mutation UpdateAward($id: String!, $input: UpdateAwardInput!) {
    updateAward(id: $id, input: $input) {
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

export function useUpdateAward() {
  return useMutation(UpdateAwardMutation, {
    refetchQueries: ['GetPublicProfile'],
  });
}
