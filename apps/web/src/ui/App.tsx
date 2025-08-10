import React from 'react';

async function fetchJSON<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

export function App() {
  const [health, setHealth] = React.useState<{ ok: boolean; time: string } | null>(null);

  React.useEffect(() => {
    fetchJSON<{ ok: boolean; time: string }>('/api/health').then(setHealth).catch(console.error);
  }, []);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: 24 }}>
      <h1>Farm Management SaaS</h1>
      <p>Status: {health ? `OK at ${health.time}` : 'Loading...'}</p>
      <section>
        <h2>Next steps</h2>
        <ul>
          <li>Create farms, fields, and tasks via API routes.</li>
          <li>Wire UI components to list and mutate data.</li>
          <li>Add persistence by swapping repositories to a database.</li>
        </ul>
      </section>
    </div>
  );
}
