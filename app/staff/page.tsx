import { getRecentActivity } from '@/lib/dashboard/activity'

export default async function StaffDashboard() {
  const activity = await getRecentActivity()

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold">
        POG Advisory Workspace
      </h1>

      <p className="mt-3 text-slate-600">
        Welcome to the Staff Dashboard.
      </p>

      {/* Recent Activity */}
      <div className="mt-10 space-y-4">
        <h2 className="text-xl font-semibold">Recent Activity</h2>

        {activity.length === 0 ? (
          <p className="text-sm text-slate-500">
            No recent activity yet.
          </p>
        ) : (
          activity.map((item) => (
            <div key={item.id} className="rounded-xl border p-4">
              <p className="font-medium">{item.action}</p>

              {item.description && (
                <p className="text-sm text-slate-500">
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
