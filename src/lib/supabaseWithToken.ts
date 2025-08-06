import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Simple Supabase client that uses anon key only
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: async (url, options = {}) => {
      return fetch(url, {
        ...options,
        headers: {
          ...(options.headers || {}),
          apikey: supabaseAnonKey,
        },
      });
    },
  },
});
