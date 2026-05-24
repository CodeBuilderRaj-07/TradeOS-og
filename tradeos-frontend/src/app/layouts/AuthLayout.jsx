import { motion } from "framer-motion";

export default function AuthLayout({
  children,
}) {

  return (

    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050816] px-4 py-10">

      {/* Glow Effects */}
      <div className="absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-blue-500/10 blur-3xl" />

      <div className="absolute bottom-[-120px] right-[-120px] h-[320px] w-[320px] rounded-full bg-blue-500/10 blur-3xl" />

      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Content */}
      <motion.div

        initial={{
          opacity: 0,
          y: 20,
        }}

        animate={{
          opacity: 1,
          y: 0,
        }}

        transition={{
          duration: 0.45,
        }}

        className="relative z-10 w-full max-w-md rounded-[32px] border border-white/5 bg-white/[0.03] p-8 shadow-[0_0_60px_rgba(37,99,235,0.08)] backdrop-blur-2xl"
      >

        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">

          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-blue-500 text-2xl font-black text-white shadow-[0_0_45px_rgba(37,99,235,0.35)]">

            ↗

          </div>

          <h1 className="mt-5 text-3xl font-black tracking-tight text-white">

            TradeOS

          </h1>

          <p className="mt-2 text-sm text-zinc-500">

            Professional Trading Workspace

          </p>

        </div>

        {children}

      </motion.div>

    </div>
  );
}