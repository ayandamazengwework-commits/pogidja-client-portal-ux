import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl

  const code = searchParams.get('code')
  const next = searchParams.get('next')

  if (!code) {
    return NextResponse.redirect(
      `${origin}/auth/error`
    )
  }

  const supabase = await createClient()

  const { error } =
    await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(
      `${origin}/auth/error`
    )
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(
      `${origin}/auth/login`
    )
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  // --------------------------------------------------
  // Password recovery
  // --------------------------------------------------

  if (next) {
    return NextResponse.redirect(
      `${origin}${next}`
    )
  }

  // --------------------------------------------------
  // Staff
  // --------------------------------------------------

  if (
    profile?.role === 'staff' ||
    profile?.role === 'manager' ||
    profile?.role === 'admin'
  ) {
    return NextResponse.redirect(
      `${origin}/staff`
    )
  }

  // --------------------------------------------------
  // Client
  // --------------------------------------------------

  return NextResponse.redirect(
    `${origin}/portal/onboarding`
  )
}
