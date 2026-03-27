import { useMutation } from '@apollo/client/react';
import { graphql } from '@/generated';

const UpdateProfileMutation = graphql(`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      userId
      email
      name
      roles
      firstName
      lastName
      avatarUrl
      bio
      headline
      location
    }
  }
`);

export function useUpdateProfile() {
  return useMutation(UpdateProfileMutation, {
    refetchQueries: ['Me'],
  });
}
