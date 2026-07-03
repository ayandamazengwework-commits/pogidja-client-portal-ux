import { createClient } from '@/lib/supabase/server'

export async function getRecentActivity(limit = 10) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('activity_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error(error)
    return []
  }

  return data
}
