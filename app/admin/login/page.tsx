'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (mounted && session) {
        window.location.replace('/admin');
      }
    }

    void checkSession();

    return () => {
      mounted = false;
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (!data.session) {
      setError('Authenticated, but no session was created. Check Supabase auth settings.');
      setLoading(false);
      return;
    }

    window.location.assign('/admin');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="font-mono text-cyan-400 text-sm tracking-[4px] mb-2">KAIROS_OS</div>
          <h1 className="text-2xl font-bold text-white">Control Deck</h1>
          <p className="text-gray-500 text-sm mt-1">Admin authentication required</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1 font-mono tracking-wider">EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#111118] border border-[#1e1e2e] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1 font-mono tracking-wider">PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#111118] border border-[#1e1e2e] rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>
          {error && <p className="text-red-400 text-xs font-mono">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-bold py-2 px-4 rounded text-sm transition-colors"
          >
            {loading ? 'AUTHENTICATING...' : 'ACCESS CONTROL DECK'}
          </button>
        </form>
      </div>
    </div>
  );
}
