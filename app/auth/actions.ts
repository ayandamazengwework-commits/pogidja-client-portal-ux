'use server'

import { supabaseAdmin } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'


export async function sendClientOTP(
  clientReference: string
) {

  const admin =
    supabaseAdmin


  const reference =
    clientReference
      .trim()
      .replace(/\s+/g, '')
      .toUpperCase()



  if (!reference) {
    return {
      error:
        'Please enter your Client Reference.',
    }
  }



  const {
    data: client,
    error: clientError,
  } =
    await admin
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


  const supabase =
    await createClient()



  const {
    error,
  } =
    await supabase.auth.signInWithOtp({

      email:
        client.email,

      options: {

        shouldCreateUser:
          false,

      },

    })



  if (error) {

    return {
      error:
        error.message,
    }

  }



  return {

    success:
      true,

    email:
      client.email,

  }

}
