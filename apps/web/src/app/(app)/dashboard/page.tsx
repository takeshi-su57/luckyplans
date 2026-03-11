'use client';

import { useHealth } from '@/hooks/use-health';

export default function AppHome() {
  const { data, loading, error } = useHealth();

  return (
    <main className="p-8 font-sans">
      <h1 className="text-2xl font-bold mb-4">LuckyPlans</h1>
      <section>
        <h2 className="text-xl mb-2">API Status</h2>
        {loading && <p className="text-gray-500">Checking API connection...</p>}
        {error && <p className="text-red-600">API Error: {error.message}</p>}
        {data && <p className="text-green-600">API Connected: {data.health}</p>}
      </section>
    </main>
  );
}
