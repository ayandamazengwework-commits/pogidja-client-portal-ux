import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import { NewClientForm } from '@/components/staff/new-client-form'

export default function NewClientPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-[#17365D] p-8 text-white shadow-xl">

        <Link
          href="/staff/clients"
          className="inline-flex items-center text-sm text-blue-200 hover:text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Clients
        </Link>

        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.35em] text-blue-200">
          CLIENT ONBOARDING
        </p>

        <h1 className="mt-3 text-4xl font-bold">
          Create New Client
        </h1>

        <p className="mt-4 max-w-2xl text-slate-300">
          Create the client's profile, assign services and send them an invitation
          to upload their documents through the client portal.
        </p>

      </section>

      <NewClientForm />
    </div>
  )
}
