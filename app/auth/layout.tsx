import type { ReactNode } from "react"
import Image from "next/image"

export default function AuthLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4">

      {/* Animated Background */}
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

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/60 bg-white/90 p-8 shadow-2xl backdrop-blur-xl">

        {/* Logo */}
        <div className="mb-6 flex flex-col items-center">

          <Image
            src="/logo.png"
            alt="POG Advisory"
            width={56}
            height={56}
            priority
          />

          <h1 className="mt-4 text-center text-3xl font-extrabold tracking-tight text-slate-900">
            POG <span className="text-sky-600">Advisory</span>
          </h1>

          <p className="mt-1 text-lg font-medium text-slate-700">
            Client Portal
          </p>

          <p className="mt-3 max-w-xs text-center text-sm leading-6 text-slate-500">
            Securely access your documents, monitor your cases and communicate
            with your accountant.
          </p>

        </div>

        {/* Login Form */}
        {children}

      </div>

    </div>
  )
}
