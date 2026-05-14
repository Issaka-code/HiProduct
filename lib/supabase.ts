import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || ''

if (!supabaseUrl || !supabaseAnonKey || !supabaseUrl.startsWith('https://')) {
  console.warn("Supabase environment variables are missing or invalid. Check your .env.local")
}

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)
