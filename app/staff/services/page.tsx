import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function ServicesPage() {
  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-4xl font-bold">
          Service Requests
        </h1>

        <p className="mt-2 text-muted-foreground">
          Manage all client service requests.
        </p>
      </div>

      <Button asChild>
        <Link href="/staff/services/new">
          + New Service Request
        </Link>
      </Button>

      <div className="rounded-xl border p-12 text-center text-muted-foreground">
        No service requests yet.
      </div>

    </div>
  )
}
