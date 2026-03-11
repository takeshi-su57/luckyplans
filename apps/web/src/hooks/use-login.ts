import { useMutation } from '@apollo/client/react';
import { graphql } from '@/generated';

const LoginMutation = graphql(`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      success
      message
      token
    }
  }
`);

export function useLogin() {
  return useMutation(LoginMutation);
}
