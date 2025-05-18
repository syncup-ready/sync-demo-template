import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase environment variables");
  console.error("URL:", supabaseUrl);
  console.error("KEY:", supabaseKey);
  throw new Error("Supabase URL or Key not set in .env");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
