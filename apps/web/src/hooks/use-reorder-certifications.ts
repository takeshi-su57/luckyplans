import { useMutation } from '@apollo/client/react';
import { graphql } from '@/generated';

const ReorderCertificationsMutation = graphql(`
  mutation ReorderCertifications($input: ReorderInput!) {
    reorderCertifications(input: $input) {
      success
    }
  }
`);

export function useReorderCertifications() {
  return useMutation(ReorderCertificationsMutation, {
    refetchQueries: ['GetPublicProfile'],
  });
}
