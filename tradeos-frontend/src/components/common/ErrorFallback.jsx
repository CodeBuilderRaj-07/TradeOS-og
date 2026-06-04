import {
  RefreshCcw,
  AlertTriangle,
} from "lucide-react";

export default function ErrorFallback({
  error,
  resetErrorBoundary,
}) {

  return (

    <div className="flex min-h-screen items-center justify-center bg-background px-4">

      <div className="w-full max-w-lg rounded-xl border border-destructive/10 bg-card/30 p-8 text-center backdrop-blur-2xl">

        {/* Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-lg bg-destructive/10">

          <AlertTriangle
            size={38}
            className="text-red-400"
          />

        </div>

        {/* Heading */}
        <h1 className="mt-6 text-3xl font-black tracking-tight text-foreground">

          Something went wrong

        </h1>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">

          An unexpected application error occurred.
          Please try refreshing the page.

        </p>

        {/* Error */}
        {error?.message && (

          <div className="mt-6 rounded-lg border border-red-500/10 bg-red-500/5 p-4 text-left">

            <p className="text-xs leading-6 text-red-300">

              {error.message}

            </p>

          </div>

        )}

        {/* Button */}
        <button
          onClick={resetErrorBoundary}
          className="mt-8 inline-flex h-14 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors"
        >

          <RefreshCcw size={18} />

          Reload Application

        </button>

      </div>

    </div>
  );
}