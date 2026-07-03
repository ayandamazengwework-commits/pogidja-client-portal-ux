import type { ReactNode } from "react"
import Image from "next/image"

export default function AuthLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-8">

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-52 -left-52 h-[700px] w-[700px] rounded-full bg-sky-300/25 blur-3xl animate-pulse" />

        <div
          className="absolute -bottom-52 -right-52 h-[700px] w-[700px] rounded-full bg-blue-500/20 blur-3xl"
          style={{
            animation: "float 14s ease-in-out infinite",
          }}
        />

        <div
          className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-200/20 blur-3xl"
          style={{
            animation: "float2 18s ease-in-out infinite",
          }}
        />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/40 bg-white/90 p-8 shadow-2xl backdrop-blur-xl">

        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">

          <Image
            src="/logo.png"
            alt="POG Advisory"
            width={60}
            height={60}
            priority
          />

          <h1 className="mt-5 text-center text-4xl font-black tracking-tight text-slate-900">
            POG <span className="text-sky-600">Advisory</span>
          </h1>

          <p className="mt-2 text-center text-lg text-slate-700">
            Client Portal
          </p>

          <p className="mt-4 max-w-xs text-center text-sm leading-6 text-slate-500">
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
