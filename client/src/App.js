import React, { useEffect, useState } from 'react';

function App() {
  const [foods, setFoods] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('📡 Fetching /api/foods directly…');
    fetch('/api/foods')
      .then(res => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log('✅ Received data:', data);
        setFoods(data);
      })
      .catch(err => {
        console.error('❌ Fetch error:', err);
        setError(err.message);
      });
  }, []);

  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (!foods) return <p>Loading…</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Direct Fetch Test</h1>
      <ul>
        {foods.map(f => (
          <li key={f._id}>{f.name} — ${f.price}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
