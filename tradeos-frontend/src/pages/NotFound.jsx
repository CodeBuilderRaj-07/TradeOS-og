import { motion } from "framer-motion";

import {
  Link,
} from "react-router-dom";

import {
  ArrowLeft,
  Compass,
} from "lucide-react";

export default function NotFound() {

  return (

    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050816] px-4">

      {/* Glow */}
      <div className="absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-blue-500/10 blur-3xl" />

      <div className="absolute bottom-[-120px] right-[-120px] h-[320px] w-[320px] rounded-full bg-blue-500/10 blur-3xl" />

      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Content */}
      <motion.div

        initial={{
          opacity: 0,
          scale: 0.96,
        }}

        animate={{
          opacity: 1,
          scale: 1,
        }}

        transition={{
          duration: 0.4,
        }}

        className="relative z-10 w-full max-w-xl rounded-[36px] border border-white/5 bg-white/[0.03] p-10 text-center backdrop-blur-2xl"
      >

        {/* Icon */}
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[28px] bg-blue-500/10">

          <Compass
            size={42}
            className="text-blue-400"
          />

        </div>

        {/* 404 */}
        <h1 className="mt-8 text-7xl font-black tracking-tight text-white">

          404

        </h1>

        <h2 className="mt-3 text-2xl font-bold text-white">

          Page Not Found

        </h2>

        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-zinc-500">

          The page you are looking for doesn’t exist,
          may have been moved,
          or is temporarily unavailable.

        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">

          <Link
            to="/"
            className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_35px_rgba(37,99,235,0.25)]"
          >

            <ArrowLeft size={18} />

            Back to Dashboard

          </Link>

          <button
            onClick={() =>
              window.history.back()
            }
            className="flex h-14 items-center justify-center rounded-2xl border border-white/5 bg-white/[0.03] px-6 text-sm font-semibold text-white transition-all duration-300 hover:border-blue-500/20"
          >

            Go Back

          </button>

        </div>

      </motion.div>

    </div>
  );
}