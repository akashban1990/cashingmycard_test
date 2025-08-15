'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type CardRow = {
  id: string;
  user_id: string;
  bank: string;
  carrier: string;
  card_name: string;
  created_at: string;
};

export default function CardsPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [cards, setCards] = useState<CardRow[]>([]);
  const [bank, setBank] = useState('');
  const [carrier, setCarrier] = useState('Visa');
  const [cardName, setCardName] = useState('');
  const [status, setStatus] = useState('');

  // Load session + user's cards
  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setStatus('❌ Please log in at /login');
        return;
      }
      setEmail(session.user.email ?? null);
      await refreshCards();
    };

    // keep UI in sync if auth changes
    const { data: sub } = supabase.auth.onAuthStateChange(() => load());
    load();

    return () => sub.subscription.unsubscribe();
  }, []);

  const refreshCards = async () => {
    const { data, error } = await supabase
      .from('user_cards')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setStatus(`⚠️ Load failed: ${error.message}`);
      return;
    }
    setCards(data ?? []);
    setStatus('');
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Saving…');

    // Make sure user is logged in and get their id
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) {
      setStatus('❌ Not authenticated');
      return;
    }

    // Insert with user_id = user.id (uuid)
    const { error } = await supabase.from('user_cards').insert([
      {
        user_id: user.id,
        bank: bank.trim(),
        carrier,
        card_name: cardName.trim(),
      },
    ]);

    if (error) {
      setStatus(`❌ Insert failed: ${error.message}`);
      return;
    }

    setBank('');
    setCarrier('Visa');
    setCardName('');
    setStatus('✅ Card added');
    await refreshCards();
  };

  const handleDelete = async (id: string) => {
    setStatus('Deleting…');
    const { error } = await supabase.from('user_cards').delete().eq('id', id);
    if (error) {
      setStatus(`❌ Delete failed: ${error.message}`);
      return;
    }
    setStatus('✅ Deleted');
    await refreshCards();
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setCards([]);
    setEmail(null);
    setStatus('Signed out');
  };

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Cards</h1>
        <div className="text-sm text-gray-600">
          {email ? (
            <div className="flex items-center gap-3">
              <span>Signed in as {email}</span>
              <button
                onClick={handleSignOut}
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
              >
                Sign out
              </button>
            </div>
          ) : (
            <a href="/login" className="text-blue-600 underline">Go to Login</a>
          )}
        </div>
      </header>

      {/* Add Card Form */}
      <form onSubmit={handleAdd} className="grid grid-cols-1 gap-3 bg-white p-4 rounded border">
        <input
          value={bank}
          onChange={(e) => setBank(e.target.value)}
          placeholder="Bank (e.g., Scotiabank)"
          required
          className="px-3 py-2 border rounded text-black"
        />

        <select
          value={carrier}
          onChange={(e) => setCarrier(e.target.value)}
          className="px-3 py-2 border rounded text-black"
        >
          <option>Visa</option>
          <option>Mastercard</option>
          <option>Amex</option>
          <option>Discover</option>
        </select>

        <input
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
          placeholder="Card Name (e.g., Gold Amex)"
          required
          className="px-3 py-2 border rounded text-black"
        />

        <button
          type="submit"
          className="mt-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Add Card
        </button>
      </form>

      {status && <p className="text-sm text-gray-700">{status}</p>}

      {/* Card List */}
      <section className="space-y-2">
        {cards.length === 0 ? (
          <p className="text-gray-600">No cards yet.</p>
        ) : (
          cards.map((c) => (
            <div key={c.id} className="flex items-center justify-between border rounded p-3 bg-white">
              <div>
                <div className="font-medium">{c.card_name}</div>
                <div className="text-sm text-gray-600">{c.bank} • {c.carrier}</div>
              </div>
              <button
                onClick={() => handleDelete(c.id)}
                className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </section>
    </main>
  );
}
