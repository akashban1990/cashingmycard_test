'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function TestDBPage() {
  const [status, setStatus] = useState('Checking auth…');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setStatus('❌ User not logged in');
        return;
      }

      const uid = user.uid;

      const insertResult = await supabase.from('user_cards').insert([
        {
          user_id: uid,
          bank: 'Test Bank',
          carrier: 'Visa',
          card_name: 'Test Gold Card',
        },
      ]);

      if (insertResult.error) {
        setStatus(`❌ Insert failed: ${insertResult.error.message}`);
        return;
      }

      const fetchResult = await supabase
        .from('user_cards')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false })
        .limit(1);

      if (fetchResult.error) {
        setStatus(`⚠️ Inserted, but fetch failed: ${fetchResult.error.message}`);
      } else if (fetchResult.data && fetchResult.data.length > 0) {
        const card = fetchResult.data[0];
        setStatus(`✅ Inserted and fetched card: ${card.card_name}`);
      } else {
        setStatus(`⚠️ Inserted, but no data fetched`);
      }
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold mb-2">Supabase Insert Test</h1>
      <p>{status}</p>
    </main>
  );
}
