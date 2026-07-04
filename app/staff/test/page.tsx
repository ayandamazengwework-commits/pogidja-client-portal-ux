import { createClient } from '@/lib/supabase/server'

export default async function TestPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <pre className="p-10">
      {JSON.stringify(user, null, 2)}
    </pre>
  )
}
