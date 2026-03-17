import { useQuery } from '@apollo/client/react';
import { graphql } from '@/generated';

const MeQuery = graphql(`
  query Me {
    me {
      userId
      email
      name
      roles
      firstName
      lastName
      avatarUrl
      bio
    }
  }
`);

export function useCurrentUser() {
  const { data, loading, error } = useQuery(MeQuery);

  return {
    user: data?.me ?? null,
    isLoading: loading,
    isAuthenticated: !!data?.me,
    error,
  };
}
