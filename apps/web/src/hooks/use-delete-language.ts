import { useMutation } from '@apollo/client/react';
import { graphql } from '@/generated';

const DeleteLanguageMutation = graphql(`
  mutation DeleteLanguage($id: String!) {
    deleteLanguage(id: $id) {
      success
    }
  }
`);

export function useDeleteLanguage() {
  return useMutation(DeleteLanguageMutation, {
    refetchQueries: ['GetPublicProfile'],
  });
}
