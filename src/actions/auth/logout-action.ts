import { createClient } from "@/lib/supabase/server"

export async function signOut() {
  const supabase = await createClient()
  
  supabase.auth.signOut()
}
