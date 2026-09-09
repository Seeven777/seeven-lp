import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabaseDiagnostics = {
  hasUrl: Boolean(url),
  hasKey: Boolean(publishableKey),
  keyMode: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ? 'publishable' : (import.meta.env.VITE_SUPABASE_ANON_KEY ? 'legacy-anon' : 'missing')
}

export const supabase = url && publishableKey ? createClient(url, publishableKey) : null
export const supabaseEnabled = Boolean(supabase)
