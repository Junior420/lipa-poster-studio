'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin }),
    });
    setLoading(false);
    if (res.ok) {
      router.push(params.get('next') || '/admin');
      router.refresh();
    } else {
      setError('Wrong PIN. Try again.');
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-xs flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#141418] p-6"
    >
      <h1 className="font-display text-xl font-bold text-center">Enter PIN</h1>
      <input
        type="password"
        inputMode="numeric"
        autoFocus
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        className="rounded-lg bg-black/40 border border-white/10 px-4 py-3 text-center text-lg tracking-widest outline-none focus:border-[#f5c518]"
        placeholder="••••"
      />
      {error && <p className="text-red-400 text-sm text-center">{error}</p>}
      <button
        disabled={loading}
        className="rounded-lg bg-[#f5c518] px-4 py-3 font-display font-bold text-black disabled:opacity-50"
      >
        {loading ? 'Checking…' : 'Unlock'}
      </button>
    </form>
  );
}
