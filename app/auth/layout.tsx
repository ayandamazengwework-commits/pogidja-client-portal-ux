import type { ReactNode } from "react";

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-white via-sky-50 to-blue-100">

      <div className="absolute inset-0">

        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-400/20 blur-3xl animate-pulse" />

        <div className="absolute right-0 top-0 h-[450px] w-[450px] rounded-full bg-sky-300/30 blur-3xl animate-pulse" />

        <div className="absolute bottom-0 left-0 h-[450px] w-[450px] rounded-full bg-blue-500/20 blur-3xl animate-pulse" />

      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,.8),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(30,136,229,.15),transparent_45%)]" />

      <div className="relative z-10 flex w-full justify-center px-6">
        {children}
      </div>

    </main>
  );
}
