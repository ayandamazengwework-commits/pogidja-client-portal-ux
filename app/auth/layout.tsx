import type { ReactNode } from "react";

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-gradient-to-br from-white via-[#EEF7FF] to-[#D8EBFF] px-4 py-10 sm:px-6 lg:px-8">

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">

        <div className="absolute -left-48 -top-40 h-[550px] w-[550px] rounded-full bg-blue-500/15 blur-[140px] animate-pulse" />

        <div
          className="absolute right-[-120px] top-[-100px] h-[500px] w-[500px] rounded-full bg-sky-400/20 blur-[140px] animate-pulse"
          style={{ animationDelay: "2s" }}
        />

        <div
          className="absolute bottom-[-180px] left-[25%] h-[600px] w-[600px] rounded-full bg-cyan-300/20 blur-[160px] animate-pulse"
          style={{ animationDelay: "4s" }}
        />

      </div>

      {/* Wave */}
      <div className="absolute bottom-0 left-0 right-0 opacity-60">

        <svg
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          className="h-[220px] w-full md:h-[300px]"
        >
          <path
            fill="#ffffff"
            fillOpacity="0.8"
            d="M0,224L80,197.3C160,171,320,117,480,117.3C640,117,800,171,960,186.7C1120,203,1280,181,1360,170.7L1440,160V320H0Z"
          />
        </svg>

      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-[460px]">

        <div className="rounded-[32px] border border-white/70 bg-white/80 p-8 shadow-[0_20px_70px_rgba(0,0,0,0.12)] backdrop-blur-2xl sm:p-10">

          {children}

        </div>

      </div>

    </main>
  );
}
