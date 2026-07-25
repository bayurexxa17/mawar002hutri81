import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://afyyozywnupfdcshxjhk.supabase.co'
const supabaseAnonKey = 'sb_publishable_EMfJHsDHNjTIatH07CuIzA_BopfHXTe'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
