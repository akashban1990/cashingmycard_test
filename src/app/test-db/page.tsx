'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestDBPage() {
  const [status, setStatus] = useState('Checking auth...');

  useEffect(() => {
    const run = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) {
        setStatus('❌ Not logged in');
        return;
      }

      try {
        // Insert a test card with the Supabase Auth user id (uuid)
        const insertRes = await supabase.from('user_cards').insert([
          {
            user_id: user.id,       // <-- uuid from Supabase Auth
            bank: 'Test Bank',
            carrier: 'Visa',
            card_name: 'Test Rewards Card',
          },
        ]);
        if (insertRes.error) throw insertRes.error;

        // Fetch latest row for this user
        const { data, error } = await supabase
          .from('user_cards')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) throw error;

        if (data && data.length > 0) {
          setStatus(`✅ Inserted & fetched: ${data[0].card_name}`);
        } else {
          setStatus('⚠️ Inserted, but no data fetched');
        }
      } catch (e: any) {
        setStatus(`❌ ${e.message}`);
      }
    };

    run();
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold mb-2">Supabase Insert Test (Auth + RLS)</h1>
      <p>{status}</p>
    </main>
  );
}
