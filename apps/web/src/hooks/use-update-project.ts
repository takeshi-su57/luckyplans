import { useMutation } from '@apollo/client/react';
import { graphql } from '@/generated';

const UpdateProjectMutation = graphql(`
  mutation UpdateProject($id: String!, $input: UpdateProjectInput!) {
    updateProject(id: $id, input: $input) {
      id
      title
      description
      images
      liveUrl
      repoUrl
      tags
      sortOrder
      createdAt
      updatedAt
    }
  }
`);

export function useUpdateProject() {
  return useMutation(UpdateProjectMutation, {
    refetchQueries: ['GetPublicProfile'],
  });
}
