import { Clock3 } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'

interface Props {
  serviceId: string
}

export async function ServiceHistory({
  serviceId,
}: Props) {
  const supabase = await createClient()

  const { data: logs } = await supabase
    .from('activity_logs')
    .select('*')
    .eq('entity_type', 'service')
    .eq('entity_id', serviceId)
    .order('created_at', {
      ascending: false,
    })

  return (
    <div className="space-y-4">

      {logs?.length ? (
        logs.map((log) => (
          <div
            key={log.id}
            className="rounded-2xl border bg-white p-5"
          >
            <div className="flex items-start gap-3">

              <Clock3 className="mt-1 h-5 w-5 text-blue-600" />

              <div className="flex-1">

                <p className="font-semibold">
                  {log.action}
                </p>

                <p className="mt-1 text-sm text-slate-600">
                  {log.description}
                </p>

                <p className="mt-2 text-xs text-slate-400">
                  {new Date(
                    log.created_at
                  ).toLocaleString()}
                </p>

              </div>

            </div>
          </div>
        ))
      ) : (
        <div className="rounded-2xl border border-dashed p-8 text-center text-slate-500">
          No activity yet.
        </div>
      )}

    </div>
  )
}
