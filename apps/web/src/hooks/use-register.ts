import { useMutation } from '@apollo/client/react';
import { graphql } from '@/generated';

const RegisterMutation = graphql(`
  mutation Register($email: String!, $password: String!, $name: String!) {
    register(email: $email, password: $password, name: $name) {
      success
      message
      token
    }
  }
`);

export function useRegister() {
  return useMutation(RegisterMutation);
}
