import { createClient } from '@supabase/supabase-js';

// TODO: Replace with your actual Supabase project URL and anon public key
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseAnonKey = 'YOUR_ANON_PUBLIC_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
