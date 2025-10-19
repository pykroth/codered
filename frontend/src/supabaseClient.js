import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_supabase_url;
const supabaseAnonKey = import.meta.env.VITE_supabase_anon_key;

if (!supabaseUrl) {
  throw new Error('Missing environment variable: VITE_supabase_url. Please create a .env file with your Supabase URL.');
}

if (!supabaseAnonKey) {
  throw new Error('Missing environment variable: VITE_supabase_anon_key. Please create a .env file with your Supabase anon key.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);