import { useMutation } from '@apollo/client/react';
import { graphql } from '@/generated';

const DeleteProjectMutation = graphql(`
  mutation DeleteProject($id: String!) {
    deleteProject(id: $id) {
      success
    }
  }
`);

export function useDeleteProject() {
  return useMutation(DeleteProjectMutation, {
    refetchQueries: ['GetPublicProfile'],
  });
}
