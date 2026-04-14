import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://mxwiawnjpciagwiyseat.supabase.co";
const supabaseAnonKey = "sb_publishable__Wd0J_rKiTOqecAVoXPJCA_f8KZN3p0";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);