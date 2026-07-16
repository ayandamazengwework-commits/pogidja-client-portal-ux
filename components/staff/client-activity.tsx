import { createClient } from '@/lib/supabase/server'

interface Props {
  clientId: string
}

export async function ClientActivity({
  clientId,
}: Props) {
  const supabase = await createClient()

  const { data: activity } = await supabase
    .from('activity_logs')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', {
      ascending: false,
    })

  return (
    <div className="rounded-3xl border bg-white shadow-sm">

      <div className="border-b px-6 py-5">

        <h2 className="text-xl font-bold">
          Activity Timeline
        </h2>

      </div>

      <div className="space-y-4 p-6">

        {activity?.length ? (

          activity.map((item) => (

            <div
              key={item.id}
              className="border-l-2 border-blue-500 pl-5"
            >

              <p className="font-semibold">
                {item.action}
              </p>

              <p className="mt-1 text-sm text-slate-600">
                {item.description}
              </p>

              <p className="mt-2 text-xs text-slate-400">

                {new Date(
                  item.created_at
                ).toLocaleString()}

              </p>

            </div>

          ))

        ) : (

          <p className="text-slate-500">

            No activity yet.

          </p>

        )}

      </div>

    </div>
  )
}
