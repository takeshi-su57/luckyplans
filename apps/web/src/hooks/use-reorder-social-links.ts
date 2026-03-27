import { useMutation } from '@apollo/client/react';
import { graphql } from '@/generated';

const ReorderSocialLinksMutation = graphql(`
  mutation ReorderSocialLinks($input: ReorderInput!) {
    reorderSocialLinks(input: $input) {
      success
    }
  }
`);

export function useReorderSocialLinks() {
  return useMutation(ReorderSocialLinksMutation, {
    refetchQueries: ['GetPublicProfile'],
  });
}
