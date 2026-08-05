'use server'

import { createClient } from '@/lib/supabase/server'

export async function sendClientOTP(
  clientReference: string
) {
  const supabase = await createClient()

  const reference =
  clientReference
    .trim()
    .replace(/\s+/g, '')
    .toUpperCase()

  if (!reference) {
    return {
      error: 'Please enter your Client Reference.',
    }
  }


  /*
    Find client by reference
  */

  const {
    data: client,
    error: clientError,
  } =
    await supabase
      .from('profiles')
      .select(
        `
        id,
        email,
        role,
        client_reference
        `
      )
      .ilike(
  'client_reference',
  reference
)
      .eq(
        'role',
        'client'
      )
      .single()


  if (
    clientError ||
    !client
  ) {
    return {
      error:
        'Invalid Client Reference.',
    }
  }


  if (!client.email) {
    return {
      error:
        'No email address is linked to this account.',
    }
  }


  /*
    Send OTP
  */

  const {
    error,
  } =
    await supabase.auth.signInWithOtp({
      email: client.email,
      options: {
        shouldCreateUser: false,
      },
    })


  if (error) {
    return {
      error: error.message,
    }
  }


  return {
    success: true,
    email: client.email,
  }
}
