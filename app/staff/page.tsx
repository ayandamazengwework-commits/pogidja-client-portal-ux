import { createClient } from '@/lib/supabase/server'
import { getRecentActivity } from '@/lib/dashboard/activity'

export default async function StaffDashboard() {
  const supabase = await createClient()

  const activity = await getRecentActivity()

  const { count: totalClients } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'client')

  const { count: totalServices } = await supabase
    .from('services')
    .select('*', { count: 'exact', head: true })

  const { count: totalDocuments } = await supabase
    .from('documents')
    .select('*', { count: 'exact', head: true })

  return (
    <div className="space-y-8 p-10">
      <div>
        <h1 className="text-4xl font-bold">
          POG Advisory Workspace
        </h1>

        <p className="mt-2 text-slate-600">
          Welcome back.
        </p>
      </div>

      {/* Live Statistics */}
      <div className="grid gap-6 md:grid-cols-3">

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Clients
          </p>

          <p className="mt-2 text-4xl font-bold">
            {totalClients ?? 0}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Services
          </p>

          <p className="mt-2 text-4xl font-bold">
            {totalServices ?? 0}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Documents
          </p>

          <p className="mt-2 text-4xl font-bold">
            {totalDocuments ?? 0}
          </p>
        </div>

      </div>

      {/* Activity */}
      <div className="space-y-4">

        <h2 className="text-xl font-semibold">
          Recent Activity
        </h2>

        {activity.length === 0 ? (
          <div className="rounded-xl border bg-white p-6">
            <p className="text-sm text-slate-500">
              No recent activity yet.
            </p>
          </div>
        ) : (
          activity.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border bg-white p-4"
            >
              <p className="font-medium">
                {item.action}
              </p>

              {item.description && (
                <p className="mt-1 text-sm text-slate-500">
                  {item.description}
                </p>
              )}
            </div>
          ))
        )}

      </div>
    </div>
  )
}
