import { useMutation } from '@apollo/client/react';
import { graphql } from '@/generated';

const CreateLanguageMutation = graphql(`
  mutation CreateLanguage($input: CreateLanguageInput!) {
    createLanguage(input: $input) {
      id
      name
      proficiency
      sortOrder
      createdAt
      updatedAt
    }
  }
`);

export function useCreateLanguage() {
  return useMutation(CreateLanguageMutation, {
    refetchQueries: ['GetPublicProfile'],
  });
}
