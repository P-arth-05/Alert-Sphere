import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/supabase';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export const db = drizzle(supabase);