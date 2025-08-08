'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [status, setStatus] = useState('');

  useEffect(() => {
    // Optional: show current auth state
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) setStatus(`🔐 Logged in as ${session.user.email}`);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Processing...');

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setStatus('✅ Logged in successfully');
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setStatus('✅ Account created — check your email if confirm is required');
      }
    } catch (err: any) {
      setStatus(`❌ ${err.message}`);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded text-black"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded text-black"
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>

      <button
        onClick={() => setIsLogin(!isLogin)}
        className="mt-4 text-sm text-blue-600 hover:underline"
      >
        {isLogin ? 'Need an account? Sign up' : 'Already have an account? Log in'}
      </button>

      <p className="mt-4 text-sm text-gray-700">{status}</p>
    </main>
  );
}
