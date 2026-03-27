import { useMutation } from '@apollo/client/react';
import { graphql } from '@/generated';

const CreateProjectMutation = graphql(`
  mutation CreateProject($input: CreateProjectInput!) {
    createProject(input: $input) {
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

export function useCreateProject() {
  return useMutation(CreateProjectMutation, {
    refetchQueries: ['GetPublicProfile', 'Me'],
  });
}
