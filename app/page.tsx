
// File: app/page.tsx
'use client';

import { useState } from 'react';

export default function Home() {
  const [profile, setProfile] = useState({
    age: '',
    gender: '',
    income: '',
    location_type: '',
    state: '',
    caste: '',
    disability_status: '',
    existing_conditions: '',
  });
  const [chat, setChat] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [followup, setFollowup] = useState('');

  const askGemini = async (followupQuestion?: string) => {
    setLoading(true);
    const res = await fetch('/api/ask-gemini', {
      method: 'POST',
      body: JSON.stringify({ profile, followup: followupQuestion || '' }),
    });
    const data = await res.json();
    setChat(prev => [...prev, data.reply]);
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setChat([]);
    askGemini();
  };

  return (
    <main style={{ maxWidth: '700px', margin: '0 auto', padding: '1rem' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Healthcare Eligibility Checker</h1>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {Object.entries(profile).map(([key, value]) => (
          <input
            key={key}
            placeholder={key.replace(/_/g, ' ')}
            value={value}
            onChange={e => setProfile({ ...profile, [key]: e.target.value })}
            style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        ))}
        <button type="submit" style={{ gridColumn: '1 / -1', padding: '0.75rem', backgroundColor: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px' }}>Check Eligibility</button>
      </form>

      {loading && <div style={{ textAlign: 'center', marginTop: '1rem' }}>Loading...</div>}

      <div style={{ marginTop: '1rem' }}>
        {chat.map((msg, i) => (
          <div key={i} style={{ background: 'black', padding: '1rem', borderRadius: '4px', marginBottom: '1rem', whiteSpace: 'pre-wrap' }}>{msg}</div>
        ))}
      </div>

      {chat.length > 0 && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            askGemini(followup);
            setFollowup('');
          }}
          style={{ marginTop: '1rem' }}
        >
          <textarea
            value={followup}
            onChange={e => setFollowup(e.target.value)}
            placeholder="Ask a follow-up question (e.g., Why am I not eligible for Ayushman Bharat?)"
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', marginBottom: '0.5rem' }}
          />
          <button type="submit" style={{ padding: '0.75rem', backgroundColor: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px' }}>Ask</button>
        </form>
      )}
    </main>
  );
}