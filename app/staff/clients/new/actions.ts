'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

export async function createClientProfile(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const firstName = String(formData.get('first_name') ?? '')
  const lastName = String(formData.get('last_name') ?? '')
  const email = String(formData.get('email') ?? '')
  const phone = String(formData.get('phone') ?? '')

  const companyName = String(formData.get('company_name') ?? '')
  const idNumber = String(formData.get('id_number') ?? '')
  const companyRegistration = String(
    formData.get('company_registration') ?? ''
  )

  const vatNumber = String(formData.get('vat_number') ?? '')
  const taxNumber = String(formData.get('tax_number') ?? '')

  const address = String(formData.get('address') ?? '')
  const city = String(formData.get('city') ?? '')
  const province = String(formData.get('province') ?? '')
  const postalCode = String(formData.get('postal_code') ?? '')
  const notes = String(formData.get('notes') ?? '')
const serviceTitle = String(
  formData.get('service_title') ?? ''
)

const serviceType = String(
  formData.get('service_type') ?? ''
)

const serviceDescription = String(
  formData.get('service_description') ?? ''
)

const documentRequests = String(
  formData.get('document_requests') ?? ''
)
console.log(
  'SERVICE ROLE EXISTS:',
  !!process.env.SUPABASE_SERVICE_ROLE_KEY
)
console.log('EMAIL:', email)

let authUser

try {
  const { data, error } =
    await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: {
        role: 'client',
        first_name: firstName,
        last_name: lastName,
      },
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    })

  console.log('Invite data:', data)
  console.log('Invite error:', error)

  if (error) {
    throw error
  }

  authUser = data.user
} catch (err) {
  console.error('INVITE FAILED:', err)
  throw err
}

if (!authUser) {
  throw new Error('Failed to create client account.')
}

 const { data: profile, error: profileError } =
  await supabase
    .from('profiles')
    .upsert({
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      company_name: companyName,
      id_number: idNumber,
      company_registration: companyRegistration,
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
    .eq('id', authUser.id)
    .select()
    .single()

if (profileError) {
  throw new Error(profileError.message)
}

  const clientCode = `POG-${Date.now()}`

const { data: client, error: clientError } =
  await supabaseAdmin
    .from('clients')
      .insert({
        profile_id: profile.id,
        client_code: clientCode,
        status: 'Pending',
      })
      .select()
      .single()

  if (clientError)
    throw new Error(clientError.message)

  const { data: service, error: serviceError } =
  await supabaseAdmin
    .from('services')
    .insert({
      client_id: client.id,
      title: serviceTitle,
      service_type: serviceType,
      description: serviceDescription,
      status: 'Waiting For Documents',
      priority: 'Normal',
      progress: 5,
      assigned_to: user.id,
    })
    .select()
    .single()


if (serviceError) {
  throw new Error(serviceError.message)
}
  if (documentRequests && service) {

  await supabaseAdmin
    .from('document_requests')
    .insert({
      service_id: service.id,
      client_id: client.id,
      requested_documents: documentRequests,
      status: 'Pending',
    })

}
  await supabaseAdmin.from('messages').insert({
    sender_id: user.id,
    recipient_id: profile.id,
    service_id: service?.id,
    subject: 'Welcome to POG Advisory',
    body: `Welcome ${firstName}.

Your client portal has been created.

Please check your email.

You will receive a secure invitation link from POG Advisory.

Click the link to:

• Create your password
• Sign in securely
• Upload your required documents
• Complete your onboarding
• Track your services
• Message your consultant

We look forward to working with you.`,
  })

  await supabaseAdmin.from('notifications').insert({
    user_id: profile.id,
    title: 'Welcome to POG Advisory',
    message:
      'Please check your email to activate your client portal.',
    type: 'onboarding',
    link: '/portal',
    read: false,
  })

 await supabaseAdmin.from('activity_logs').insert({
    user_id: user.id,
    role: 'staff',
    client_id: client.id,
    entity_type: 'client',
    entity_id: client.id,
    action: 'Client Created',
    description: `${firstName} ${lastName} onboarded`,
  })

  revalidatePath('/staff/clients')

  redirect(`/staff/services/${service?.id}`)
}

export async function updateClient(
  clientId: string,
  formData: FormData
) {
  const supabase = await createClient()

  const { data: client } = await supabase
    .from('clients')
    .select('profile_id')
    .eq('id', clientId)
    .single()

  if (!client) throw new Error('Client not found.')

  await supabase
    .from('profiles')
    .update({
      first_name: String(formData.get('first_name') ?? ''),
      last_name: String(formData.get('last_name') ?? ''),
      email: String(formData.get('email') ?? ''),
      phone: String(formData.get('phone') ?? ''),
      company_name: String(formData.get('company_name') ?? ''),
      id_number: String(formData.get('id_number') ?? ''),
      company_registration: String(
        formData.get('company_registration') ?? ''
      ),
      vat_number: String(formData.get('vat_number') ?? ''),
      tax_number: String(formData.get('tax_number') ?? ''),
      address: String(formData.get('address') ?? ''),
      city: String(formData.get('city') ?? ''),
      province: String(formData.get('province') ?? ''),
      postal_code: String(formData.get('postal_code') ?? ''),
      notes: String(formData.get('notes') ?? ''),
    })
    .eq('id', client.profile_id)

  revalidatePath('/staff/clients')
}

export async function deleteClient(clientId: string) {
  const supabase = await createClient()

  const { data: client } = await supabase
    .from('clients')
    .select('profile_id')
    .eq('id', clientId)
    .single()

  if (!client) throw new Error('Client not found.')

  await supabase
    .from('notifications')
    .delete()
    .eq('user_id', client.profile_id)

  await supabase
    .from('messages')
    .delete()
    .or(
      `sender_id.eq.${client.profile_id},recipient_id.eq.${client.profile_id}`
    )

  await supabase
    .from('activity_logs')
    .delete()
    .eq('client_id', clientId)

  await supabase
    .from('invoices')
    .delete()
    .eq('client_id', clientId)

  await supabase
    .from('services')
    .delete()
    .eq('client_id', clientId)

  await supabase
    .from('clients')
    .delete()
    .eq('id', clientId)

  await supabase
    .from('profiles')
    .delete()
    .eq('id', client.profile_id)

  revalidatePath('/staff/clients')
}
