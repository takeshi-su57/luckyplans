import { useEffect } from 'react';
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
      headline
      location
    }
  }
`);

function isUnauthenticatedError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;

  const err = error as {
    message?: string;
    graphQLErrors?: Array<{
      message?: string;
      extensions?: { code?: string; originalError?: { statusCode?: number } };
    }>;
  };

  // Check top-level error message
  if (isAuthMessage(err.message)) return true;

  // Check each graphQLError
  return err.graphQLErrors?.some((e) =>
    e.extensions?.code === 'UNAUTHENTICATED' ||
    e.extensions?.originalError?.statusCode === 401 ||
    isAuthMessage(e.message),
  ) ?? false;
}

function isAuthMessage(msg?: string): boolean {
  if (!msg) return false;
  return /session expired|invalid.*session|expired.*session|missing session|unauthorized|please log in/i.test(msg);
}

export function useCurrentUser() {
  const { data, loading, error } = useQuery(MeQuery);

  useEffect(() => {
    if (!error || loading) return;
    if (isUnauthenticatedError(error)) {
      window.location.href = '/login?returnTo=' + window.location.pathname;
    }
  }, [error, loading]);

  return {
    user: data?.me ?? null,
    isLoading: loading,
    isAuthenticated: !!data?.me,
    error,
  };
}
