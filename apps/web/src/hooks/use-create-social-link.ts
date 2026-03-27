import { useMutation } from '@apollo/client/react';
import { graphql } from '@/generated';

const CreateSocialLinkMutation = graphql(`
  mutation CreateSocialLink($input: CreateSocialLinkInput!) {
    createSocialLink(input: $input) {
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

export function useCreateSocialLink() {
  return useMutation(CreateSocialLinkMutation, {
    refetchQueries: ['GetPublicProfile'],
  });
}
