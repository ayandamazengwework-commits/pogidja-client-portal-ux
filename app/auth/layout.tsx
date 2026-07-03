import type { ReactNode } from "react"

export default function AuthLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-6">

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-52 -left-52 h-[700px] w-[700px] rounded-full bg-sky-300/20 blur-3xl animate-pulse" />

        <div
          className="absolute -bottom-52 -right-52 h-[700px] w-[700px] rounded-full bg-blue-500/20 blur-3xl"
          style={{
            animation: "float 14s ease-in-out infinite",
          }}
        />

        <div
          className="absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-200/20 blur-3xl"
          style={{
            animation: "float2 18s ease-in-out infinite",
          }}
        />
      </div>

      <div className="relative z-20 w-full flex justify-center">
        {children}
      </div>

    </div>
  )
}
