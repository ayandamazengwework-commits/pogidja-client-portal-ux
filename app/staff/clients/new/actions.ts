'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

import { supabaseAdmin } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'


function generateClientReference() {

  const part1 =
    Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase()

  const part2 =
    Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase()


  return `POG-${part1}-${part2}`
}



export async function createClientProfile(
  formData: FormData
) {

  const supabase =
    await createClient()


  const {
    data: {
      user
    },
  } =
    await supabase.auth.getUser()



  if (!user) {
    throw new Error(
      'Not authenticated'
    )
  }



  const firstName =
    String(
      formData.get('first_name') ?? ''
    )


  const lastName =
    String(
      formData.get('last_name') ?? ''
    )


  const email =
    String(
      formData.get('email') ?? ''
    )


  const phone =
    String(
      formData.get('phone') ?? ''
    )



  const companyName =
    String(
      formData.get('company_name') ?? ''
    )


  const idNumber =
    String(
      formData.get('id_number') ?? ''
    )


  const companyRegistration =
    String(
      formData.get('company_registration') ?? ''
    )


  const vatNumber =
    String(
      formData.get('vat_number') ?? ''
    )


  const taxNumber =
    String(
      formData.get('tax_number') ?? ''
    )


  const address =
    String(
      formData.get('address') ?? ''
    )


  const city =
    String(
      formData.get('city') ?? ''
    )


  const province =
    String(
      formData.get('province') ?? ''
    )


  const postalCode =
    String(
      formData.get('postal_code') ?? ''
    )


  const notes =
    String(
      formData.get('notes') ?? ''
    )



  const serviceTitle =
    String(
      formData.get('service_title') ?? ''
    )


  const serviceType =
    String(
      formData.get('service_type') ?? ''
    )


  const serviceDescription =
    String(
      formData.get('service_description') ?? ''
    )


  const documentRequests =
    String(
      formData.get('document_requests') ?? ''
    )



  console.log(
    'SUPABASE SERVICE ROLE:',
    !!process.env.SUPABASE_SERVICE_ROLE_KEY
  )



  /*
   ===========================
   CREATE AUTH USER
   ===========================
  */


  let authUser


  try {


    const {
      data,
      error,
    } =
      await supabaseAdmin.auth.admin.createUser({

        email,

        email_confirm: true,

        user_metadata: {

          role: 'client',

          first_name: firstName,

          last_name: lastName,

        },

      })



    console.log(
      'AUTH USER:',
      data
    )


    console.log(
      'AUTH ERROR:',
      error
    )



    if (error) {
      throw error
    }


    authUser =
      data.user



  } catch(error) {


    console.error(
      'CREATE USER FAILED:',
      error
    )


    throw error

  }



  if (!authUser) {

    throw new Error(
      'Failed to create client account.'
    )

  }



  const clientReference =
    generateClientReference()

  /*
   ===========================
   CREATE PROFILE
   ===========================
  */


  const {
    data: profile,
    error: profileError,
  } =
    await supabaseAdmin
      .from('profiles')
      .update({

        first_name: firstName,

        last_name: lastName,

        email,

        client_reference: clientReference,

        phone,

        company_name: companyName,

        id_number: idNumber,

        company_registration:
          companyRegistration,

        vat_number: vatNumber,

        tax_number: taxNumber,

        address,

        city,

        province,

        postal_code: postalCode,

        active: true,

        client_status: 'Pending',

        notes,

      })
      .eq(
        'id',
        authUser.id
      )
      .select()
      .single()



  console.log(
    'PROFILE:',
    profile
  )


  console.log(
    'PROFILE ERROR:',
    profileError
  )



  if (profileError) {

    throw new Error(
      profileError.message
    )

  }





  /*
   ===========================
   CREATE CLIENT RECORD
   ===========================
  */


  const {
    data: client,
    error: clientError,
  } =
    await supabaseAdmin
      .from('clients')
      .insert({

        profile_id:
          profile.id,

        client_code:
          clientReference,

        status:
          'active',

        onboarding_status:
          'Pending Documents',

      })
      .select()
      .single()



  console.log(
    'CLIENT:',
    client
  )


  console.log(
    'CLIENT ERROR:',
    clientError
  )



  if (clientError) {

    throw new Error(
      clientError.message
    )

  }





  /*
   ===========================
   CREATE SERVICE
   ===========================
  */


  const {
    data: service,
    error: serviceError,
  } =
    await supabaseAdmin
      .from('services')
      .insert({

        client_id:
          client.id,

        title:
          serviceTitle,

        service_type:
          serviceType,

        description:
          serviceDescription,

        status:
          'Waiting For Documents',

        priority:
          'Normal',

        progress:
          5,

        assigned_to:
          user.id,

      })
      .select()
      .single()



  console.log(
    'SERVICE:',
    service
  )


  console.log(
    'SERVICE ERROR:',
    serviceError
  )



  if (serviceError) {

    throw new Error(
      serviceError.message
    )

  }





  /*
   ===========================
   DOCUMENT REQUESTS
   ===========================
  */


  if (
    documentRequests &&
    service
  ) {


    await supabaseAdmin
      .from('document_requests')
      .insert({

        service_id:
          service.id,

        client_id:
          client.id,

        requested_documents:
          documentRequests,

        status:
          'Pending',

      })

  }





  /*
   ===========================
   CLIENT MESSAGE
   ===========================
  */


  await supabaseAdmin
    .from('messages')
    .insert({

      sender_id:
        user.id,

      recipient_id:
        profile.id,

      service_id:
        service?.id,

      subject:
        'Welcome to POG Advisory',


      body:
`Welcome ${firstName}.

Your POG Advisory Client Portal has been created.

Your Client Reference is:

${clientReference}


To access your portal:

• Visit the POG Advisory Client Portal
• Enter your Client Reference
• Enter the verification code sent to your email


No password is required.

You can use your portal to:

• Track your services
• Upload requested documents
• Communicate with your consultant
• View account updates


We look forward to working with you.

POG Advisory Team`

    })

  /*
   ===========================
   CLIENT NOTIFICATION
   ===========================
  */


  await supabaseAdmin
    .from('notifications')
    .insert({

      user_id:
        profile.id,

      title:
        'Welcome to POG Advisory',


      message:
        `Your client portal has been created. Your Client Reference is ${clientReference}.`,


      type:
        'onboarding',


      link:
        '/portal',


      read:
        false,

    })





  /*
   ===========================
   ACTIVITY LOG
   ===========================
  */


  await supabaseAdmin
    .from('activity_logs')
    .insert({

      user_id:
        user.id,

      role:
        'staff',

      client_id:
        client.id,

      entity_type:
        'client',

      entity_id:
        client.id,

      action:
        'Client Created',

      description:
        `${firstName} ${lastName} onboarded with reference ${clientReference}`,

    })





  revalidatePath(
    '/staff/clients'
  )


  redirect(
    `/staff/services/${service.id}`
  )

}





export async function updateClient(
  clientId: string,
  formData: FormData
) {

  const supabase =
    await createClient()



  const {
    data: client,
  } =
    await supabase
      .from('clients')
      .select(
        'profile_id'
      )
      .eq(
        'id',
        clientId
      )
      .single()



  if (!client) {

    throw new Error(
      'Client not found.'
    )

  }




  await supabase
    .from('profiles')
    .update({

      first_name:
        String(
          formData.get('first_name') ?? ''
        ),


      last_name:
        String(
          formData.get('last_name') ?? ''
        ),


      email:
        String(
          formData.get('email') ?? ''
        ),


      phone:
        String(
          formData.get('phone') ?? ''
        ),


      company_name:
        String(
          formData.get('company_name') ?? ''
        ),


      id_number:
        String(
          formData.get('id_number') ?? ''
        ),


      company_registration:
        String(
          formData.get('company_registration') ?? ''
        ),


      vat_number:
        String(
          formData.get('vat_number') ?? ''
        ),


      tax_number:
        String(
          formData.get('tax_number') ?? ''
        ),


      address:
        String(
          formData.get('address') ?? ''
        ),


      city:
        String(
          formData.get('city') ?? ''
        ),


      province:
        String(
          formData.get('province') ?? ''
        ),


      postal_code:
        String(
          formData.get('postal_code') ?? ''
        ),


      notes:
        String(
          formData.get('notes') ?? ''
        ),

    })
    .eq(
      'id',
      client.profile_id
    )



  revalidatePath(
    '/staff/clients'
  )

}






export async function deleteClient(
  clientId: string
) {

  const supabase =
    await createClient()



  const {
    data: client,
  } =
    await supabase
      .from('clients')
      .select(
        'profile_id'
      )
      .eq(
        'id',
        clientId
      )
      .single()



  if (!client) {

    throw new Error(
      'Client not found.'
    )

  }



  await supabase
    .from('notifications')
    .delete()
    .eq(
      'user_id',
      client.profile_id
    )



  await supabase
    .from('messages')
    .delete()
    .or(
      `sender_id.eq.${client.profile_id},recipient_id.eq.${client.profile_id}`
    )



  await supabase
    .from('activity_logs')
    .delete()
    .eq(
      'client_id',
      clientId
    )



  await supabase
    .from('invoices')
    .delete()
    .eq(
      'client_id',
      clientId
    )



  await supabase
    .from('services')
    .delete()
    .eq(
      'client_id',
      clientId
    )



  await supabase
    .from('clients')
    .delete()
    .eq(
      'id',
      clientId
    )



  await supabase
    .from('profiles')
    .delete()
    .eq(
      'id',
      client.profile_id
    )



  revalidatePath(
    '/staff/clients'
  )

}
