import { getRecentActivity } from '@/lib/dashboard/activity'
const activity = await getRecentActivity()
export default function StaffDashboard() {
  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold">
        POG Advisory Workspace
      </h1>

      <p className="mt-3 text-slate-600">
        Welcome to the Staff Dashboard.
      </p>
    </div>
  );
}
