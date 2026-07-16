import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl

  const code = searchParams.get('code')
  const next = searchParams.get('next')

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/error`)
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(`${origin}/auth/error`)
  }

  // If Supabase explicitly supplied a destination,
  // use it (password reset, OAuth, etc.)
  if (next) {
    return NextResponse.redirect(`${origin}${next}`)
  }

  // Otherwise this is most likely an email verification.
  return NextResponse.redirect(`${origin}/auth/verified`)
}
