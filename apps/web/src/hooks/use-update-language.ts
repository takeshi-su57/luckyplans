import { useMutation } from '@apollo/client/react';
import { graphql } from '@/generated';

const UpdateLanguageMutation = graphql(`
  mutation UpdateLanguage($id: String!, $input: UpdateLanguageInput!) {
    updateLanguage(id: $id, input: $input) {
      id
      name
      proficiency
      sortOrder
      createdAt
      updatedAt
    }
  }
`);

export function useUpdateLanguage() {
  return useMutation(UpdateLanguageMutation, {
    refetchQueries: ['GetPublicProfile'],
  });
}
