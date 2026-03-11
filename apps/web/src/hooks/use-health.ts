import { useQuery } from '@apollo/client/react';
import { graphql } from '@/generated';

const HealthQuery = graphql(`
  query Health {
    health
  }
`);

export function useHealth() {
  return useQuery(HealthQuery);
}
