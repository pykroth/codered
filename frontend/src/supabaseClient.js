import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_supabase_url;
const supabaseAnonKey = import.meta.env.VITE_supabase_anon_key;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);