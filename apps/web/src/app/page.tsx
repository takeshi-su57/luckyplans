'use client';

import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

const HEALTH_QUERY = gql`
  query Health {
    health
  }
`;

interface HealthData {
  health: string;
}

export default function Home() {
  const { data, loading, error } = useQuery<HealthData>(HEALTH_QUERY);

  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>LuckyPlans</h1>
      <section>
        <h2>API Status</h2>
        {loading && <p>Checking API connection...</p>}
        {error && <p style={{ color: 'red' }}>API Error: {error.message}</p>}
        {data && <p style={{ color: 'green' }}>API Connected: {data.health}</p>}
      </section>
    </main>
  );
}
