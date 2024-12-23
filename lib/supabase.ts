import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Ensure URLs are properly formatted
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/^https?:/, 'http:') || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);