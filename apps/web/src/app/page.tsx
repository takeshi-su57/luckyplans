'use client';

import { gql, useQuery } from '@apollo/client';

const HEALTH_QUERY = gql`
  query Health {
    health
  }
`;

export default function Home() {
  const { data, loading, error } = useQuery(HEALTH_QUERY);

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
