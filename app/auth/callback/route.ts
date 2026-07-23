import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'


export async function GET(request: Request) {

  const { searchParams, origin } =
    new URL(request.url)


  const code = searchParams.get('code')


  if (!code) {
    console.log(
      'NO CODE:',
      request.url
    )

    return NextResponse.redirect(
      `${origin}/auth/login?error=no-code`
    )
  }


  const supabase = await createClient()


  const { error } =
    await supabase.auth.exchangeCodeForSession(code)


  if (error) {

    console.error(
      'CALLBACK ERROR:',
      error.message
    )

    return NextResponse.redirect(
      `${origin}/auth/login?error=callback`
    )
  }


  return NextResponse.redirect(
    `${origin}/auth/reset-password`
  )
}
