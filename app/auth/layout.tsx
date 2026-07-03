import type { ReactNode } from "react";

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-white via-[#eef6ff] to-[#d7eaff]">

      {/* Background Glow */}
      <div className="absolute inset-0">

        {/* Top Left */}
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#2196F3]/20 blur-[120px] animate-pulse" />

        {/* Top Right */}
        <div className="absolute right-0 top-0 h-[420px] w-[420px] rounded-full bg-[#64B5F6]/25 blur-[120px] animate-pulse" />

        {/* Bottom Left */}
        <div className="absolute bottom-0 left-0 h-[450px] w-[450px] rounded-full bg-[#1976D2]/20 blur-[140px] animate-pulse" />

        {/* Bottom Right */}
        <div className="absolute -bottom-20 right-0 h-[520px] w-[520px] rounded-full bg-white blur-[120px]" />

      </div>

      {/* Animated Wave 1 */}
      <div
        className="absolute -bottom-16 left-0 h-[320px] w-[140%] animate-[wave1_18s_ease-in-out_infinite]"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(33,150,243,.20), transparent 70%)",
          borderRadius: "45% 55% 70% 30% / 35% 40% 60% 65%",
          filter: "blur(60px)",
        }}
      />

      {/* Animated Wave 2 */}
      <div
        className="absolute -top-32 right-0 h-[350px] w-[140%] animate-[wave2_24s_ease-in-out_infinite]"
        style={{
          background:
            "radial-gradient(circle at center, rgba(100,181,246,.18), transparent 70%)",
          borderRadius: "55% 45% 30% 70% / 45% 55% 45% 55%",
          filter: "blur(80px)",
        }}
      />

      {/* Floating Light Particles */}
      <div className="absolute inset-0 overflow-hidden">

        <div className="absolute left-[10%] top-[20%] h-2 w-2 rounded-full bg-white shadow-[0_0_25px_white] animate-ping" />

        <div className="absolute left-[70%] top-[15%] h-3 w-3 rounded-full bg-white shadow-[0_0_25px_white] animate-pulse" />

        <div className="absolute left-[20%] bottom-[15%] h-2 w-2 rounded-full bg-white shadow-[0_0_25px_white] animate-ping" />

        <div className="absolute right-[15%] bottom-[20%] h-3 w-3 rounded-full bg-white shadow-[0_0_30px_white] animate-pulse" />

      </div>

      {/* Content */}
      <div className="relative z-20 w-full px-6">
        {children}
      </div>

      {/* Custom Animation */}
      <style jsx global>{`
        @keyframes wave1 {
          0% {
            transform: translateX(-5%) translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateX(0%) translateY(-25px) rotate(2deg);
          }
          100% {
            transform: translateX(-5%) translateY(0px) rotate(0deg);
          }
        }

        @keyframes wave2 {
          0% {
            transform: translateX(0%) translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateX(-3%) translateY(20px) rotate(-2deg);
          }
          100% {
            transform: translateX(0%) translateY(0px) rotate(0deg);
          }
        }
      `}</style>
    </main>
  );
}
