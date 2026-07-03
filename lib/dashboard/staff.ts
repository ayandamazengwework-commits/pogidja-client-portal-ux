import { createClient } from '@/lib/supabase/server'

export async function getDashboardStats() {
  const supabase = await createClient()

  const [
    clients,
    services,
    documents,
    messages,
  ] = await Promise.all([
    supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'client'),

    supabase
      .from('cases')
      .select('*', { count: 'exact', head: true })
      .neq('status', 'completed'),

    supabase
      .from('documents')
      .select('*', { count: 'exact', head: true }),

    supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('read', false),
  ])

  return {
    clients: clients.count ?? 0,
    services: services.count ?? 0,
    documents: documents.count ?? 0,
    messages: messages.count ?? 0,
  }
}
