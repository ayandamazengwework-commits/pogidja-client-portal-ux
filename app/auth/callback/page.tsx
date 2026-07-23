'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function CallbackPage() {
  const router = useRouter()

  useEffect(() => {
    async function handleAuth() {
      const supabase = createClient()

      const { data } = await supabase.auth.getSession()

      if (data.session) {
        router.push('/auth/update-password')
      } else {
        router.push('/auth/login?error=no-session')
      }
    }

    handleAuth()
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      Loading...
    </div>
  )
}
