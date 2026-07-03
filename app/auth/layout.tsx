import type { ReactNode } from "react"

export default function AuthLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="relative flex min-h-screen items-start justify-center overflow-hidden bg-slate-50 px-6 pt-20 pb-10">

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">

        <div className="absolute -top-72 -left-72 h-[850px] w-[850px] rounded-full bg-sky-300/20 blur-[140px] animate-pulse" />

        <div
          className="absolute -bottom-72 -right-72 h-[850px] w-[850px] rounded-full bg-blue-500/20 blur-[140px]"
          style={{
            animation: "float 16s ease-in-out infinite",
          }}
        />

        <div
          className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-200/15 blur-[120px]"
          style={{
            animation: "float2 20s ease-in-out infinite",
          }}
        />

      </div>

      {/* Login Content */}
      <div className="relative z-20 flex w-full justify-center">
        {children}
      </div>

    </div>
  )
}
