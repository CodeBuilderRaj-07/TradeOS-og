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

    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">

      {/* Glow */}
      <div className="absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-primary/10 blur-3xl" />

      <div className="absolute bottom-[-120px] right-[-120px] h-[320px] w-[320px] rounded-full bg-primary/10 blur-3xl" />

      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--foreground)/0.02)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--foreground)/0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />

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

        className="relative z-10 w-full max-w-xl rounded-[36px] border border-border bg-card/60 p-10 text-center backdrop-blur-2xl"
      >

        {/* Icon */}
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[28px] bg-primary/10">

          <Compass
            size={42}
            className="text-primary"
          />

        </div>

        {/* 404 */}
        <h1 className="mt-8 text-7xl font-black tracking-tight text-foreground">

          404

        </h1>

        <h2 className="mt-3 text-2xl font-bold text-foreground">

          Page Not Found

        </h2>

        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-muted-foreground">

          The page you are looking for doesn't exist,
          may have been moved,
          or is temporarily unavailable.

        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">

          <Link
            to="/"
            className="flex h-14 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors"
          >

            <ArrowLeft size={18} />

            Back to Dashboard

          </Link>

          <button
            onClick={() =>
              window.history.back()
            }
            className="flex h-14 items-center justify-center rounded-lg border border-border bg-card px-6 text-sm font-semibold text-foreground transition-all duration-300 hover:border-primary/20"
          >

            Go Back

          </button>

        </div>

      </motion.div>

    </div>
  );
}