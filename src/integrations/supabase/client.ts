
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = "https://lusfthgqlkgktpplplqnv.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1c2Z0aGdxbGtna3RwbHBscW52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxNTg2ODAsImV4cCI6MjA2MTczNDY4MH0.rGF7pOjYLtFNK9sOG2MXH8M5wBOMG18w3F1YMoVUQoQ"

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  realtime: {
    params: {
      eventsPerSecond: 2
    }
  }
})
