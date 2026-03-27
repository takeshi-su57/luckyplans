import { useMutation } from '@apollo/client/react';
import { graphql } from '@/generated';

const ReorderExperiencesMutation = graphql(`
  mutation ReorderExperiences($input: ReorderInput!) {
    reorderExperiences(input: $input) {
      success
    }
  }
`);

export function useReorderExperiences() {
  return useMutation(ReorderExperiencesMutation, {
    refetchQueries: ['GetPublicProfile'],
  });
}
