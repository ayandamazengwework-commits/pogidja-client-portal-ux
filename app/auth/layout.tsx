import type { ReactNode } from "react"
import Image from "next/image"

export default function AuthLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4">

      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">

        <div className="absolute -top-56 -left-56 h-[650px] w-[650px] rounded-full bg-sky-300/20 blur-3xl animate-pulse" />

        <div
          className="absolute -bottom-56 -right-56 h-[650px] w-[650px] rounded-full bg-blue-500/20 blur-3xl"
          style={{
            animation: "float 15s ease-in-out infinite",
          }}
        />

        <div
          className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-200/20 blur-3xl"
          style={{
            animation: "float2 18s ease-in-out infinite",
          }}
        />

      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/50 bg-white/90 p-8 shadow-2xl backdrop-blur-xl">

        {/* Logo */}
        <div className="mb-6 flex flex-col items-center">

          <Image
            src="/logo.png"
            alt="POG Advisory"
            width={54}
            height={54}
            priority
          />

          <h1 className="mt-4 text-center text-3xl font-extrabold tracking-tight text-slate-900">
            POG <span className="text-sky-600">Advisory</span>
          </h1>

          <p className="mt-1 text-center text-base font-medium text-slate-700">
            Client Portal
          </p>

          <p className="mt-3 max-w-xs text-center text-sm leading-6 text-slate-500">
            Securely access your documents, cases and communicate with your accountant.
          </p>

        </div>

        {children}

      </div>

    </div>
  )
}          <Image
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
