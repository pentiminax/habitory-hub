// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://exgybfhrfctzdkrfejyv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4Z3liZmhyZmN0emRrcmZlanl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5MzU1NTEsImV4cCI6MjA1ODUxMTU1MX0.EUH5D8YnxwXwaN6sOElezaJGArncjO3Jarf9tj2G_MQ";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);