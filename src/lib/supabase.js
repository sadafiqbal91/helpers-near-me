import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Supabase project URL
const supabaseUrl = "https://mxwiawnjpciagwiyseat.supabase.co";

// ✅ Publishable (Anon) Key
const supabaseAnonKey = "sb_publishable__Wd0J_rKiTOqecAVoXPJCA_f8KZN3p0";

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);