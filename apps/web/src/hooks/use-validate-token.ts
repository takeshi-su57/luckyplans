import { useQuery } from '@apollo/client/react';
import { graphql } from '@/generated';

const ValidateTokenQuery = graphql(`
  query ValidateToken($token: String!) {
    validateToken(token: $token) {
      success
      message
      token
    }
  }
`);

export function useValidateToken(token: string) {
  return useQuery(ValidateTokenQuery, {
    variables: { token },
    skip: !token,
  });
}
