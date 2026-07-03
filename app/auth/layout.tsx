import type { ReactNode } from 'react'

export default function AuthLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-4 py-10">

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-br from-white via-sky-50 to-blue-100" />

        <div className="absolute -top-32 -left-24 h-[500px] w-[500px] animate-pulse rounded-full bg-sky-300/30 blur-3xl" />

        <div
          className="absolute bottom-[-150px] right-[-100px] h-[600px] w-[600px] rounded-full bg-blue-400/20 blur-3xl"
          style={{
            animation: 'float 14s ease-in-out infinite',
          }}
        />

        <div
          className="absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/40 blur-3xl"
          style={{
            animation: 'float2 18s ease-in-out infinite',
          }}
        />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-[420px]">

        <div className="rounded-3xl border border-white/70 bg-white/80 p-8 shadow-2xl backdrop-blur-xl md:p-10">

          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <img
              src="/logo.png"
              alt="POG Advisory"
              className="h-14 w-auto"
            />
          </div>

          {/* Heading */}
          <div className="mb-8 text-center">

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Client Portal
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Securely access your tax documents, track your cases,
              upload files and communicate with your accountant.
            </p>

          </div>

          {/* Login Form */}
          {children}

        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} POG Advisory & Chartered Accountants
        </p>

      </div>

      <style>{`
        @keyframes float {
          0% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-40px) translateX(-20px);
          }
          100% {
            transform: translateY(0px) translateX(0px);
          }
        }

        @keyframes float2 {
          0% {
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.08);
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
          }
        }
      `}</style>

    </div>
  )
}
