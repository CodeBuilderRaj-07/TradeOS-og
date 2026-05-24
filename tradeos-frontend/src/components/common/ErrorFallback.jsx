import {
  RefreshCcw,
  AlertTriangle,
} from "lucide-react";

export default function ErrorFallback({
  error,
  resetErrorBoundary,
}) {

  return (

    <div className="flex min-h-screen items-center justify-center bg-[#050816] px-4">

      <div className="w-full max-w-lg rounded-[32px] border border-red-500/10 bg-white/[0.03] p-8 text-center backdrop-blur-2xl">

        {/* Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-red-500/10">

          <AlertTriangle
            size={38}
            className="text-red-400"
          />

        </div>

        {/* Heading */}
        <h1 className="mt-6 text-3xl font-black tracking-tight text-white">

          Something went wrong

        </h1>

        <p className="mt-3 text-sm leading-6 text-zinc-500">

          An unexpected application error occurred.
          Please try refreshing the page.

        </p>

        {/* Error */}
        {error?.message && (

          <div className="mt-6 rounded-2xl border border-red-500/10 bg-red-500/5 p-4 text-left">

            <p className="text-xs leading-6 text-red-300">

              {error.message}

            </p>

          </div>

        )}

        {/* Button */}
        <button
          onClick={resetErrorBoundary}
          className="mt-8 inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_35px_rgba(37,99,235,0.25)]"
        >

          <RefreshCcw size={18} />

          Reload Application

        </button>

      </div>

    </div>
  );
}