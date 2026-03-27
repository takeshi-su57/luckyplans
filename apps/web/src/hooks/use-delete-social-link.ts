import { useMutation } from '@apollo/client/react';
import { graphql } from '@/generated';

const DeleteSocialLinkMutation = graphql(`
  mutation DeleteSocialLink($id: String!) {
    deleteSocialLink(id: $id) {
      success
    }
  }
`);

export function useDeleteSocialLink() {
  return useMutation(DeleteSocialLinkMutation, {
    refetchQueries: ['GetPublicProfile'],
  });
}
