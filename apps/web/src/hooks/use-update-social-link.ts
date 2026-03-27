import { useMutation } from '@apollo/client/react';
import { graphql } from '@/generated';

const UpdateSocialLinkMutation = graphql(`
  mutation UpdateSocialLink($id: String!, $input: UpdateSocialLinkInput!) {
    updateSocialLink(id: $id, input: $input) {
      id
      platform
      url
      label
      sortOrder
      createdAt
      updatedAt
    }
  }
`);

export function useUpdateSocialLink() {
  return useMutation(UpdateSocialLinkMutation, {
    refetchQueries: ['GetPublicProfile'],
  });
}
