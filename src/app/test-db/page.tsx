'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { supabase } from '@/lib/supabase';

export default function TestDBPage() {
  const [status, setStatus] = useState('Checking auth...');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setStatus('❌ User not logged in');
        return;
      }

      try {
        const uid = user.uid;

        // Insert a test card into Supabase
        const insertResult = await supabase.from('user_cards').insert([
          {
            user_id: uid,
            bank: 'Test Bank',
            carrier: 'Visa',
            card_name: 'Test Rewards Card',
          },
        ]);

        if (insertResult.error) {
          setStatus(`❌ Insert failed: ${insertResult.error.message}`);
          return;
        }

        // Fetch the latest card for this user
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
      } catch (err: any) {
        setStatus(`❌ Unexpected error: ${err.message}`);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold mb-2">Supabase Insert Test</h1>
      <p>{status}</p>
    </main>
  );
}
