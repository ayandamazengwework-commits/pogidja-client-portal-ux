import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)

  const code = searchParams.get('code')

  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type')

  const supabase = await createClient()

  // PKCE flow
  if (code) {
    const { error } =
      await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(
        `${origin}/auth/update-password`
      )
    }

    console.error(
      'Code exchange error:',
      error.message
    )
  }


  // Token hash flow (invite links)
  if (tokenHash && type) {
    const { error } =
      await supabase.auth.verifyOtp({
        type: type as any,
        token_hash: tokenHash,
      })

    if (!error) {
      return NextResponse.redirect(
        `${origin}/auth/update-password`
      )
    }

    console.error(
      'OTP verify error:',
      error.message
    )
  }


  console.error(
    'No valid auth parameters found'
  )

  return NextResponse.redirect(
    `${origin}/auth/login?error=callback`
  )
}
