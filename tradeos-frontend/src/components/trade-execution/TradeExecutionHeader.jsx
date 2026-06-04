export default function TradeExecutionHeader({
  loading,
  handleSubmit,
}) {

  return (

    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

      <div>

        <h1 className="text-3xl font-black tracking-tight text-foreground">

          Execute Trade

        </h1>

          <p className="mt-2 text-sm text-muted-foreground">

          Professional risk-managed trade execution

        </p>

      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="inline-flex h-14 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors disabled:opacity-70"
      >

        {loading
          ? "Executing..."
          : "Execute Trade"}

      </button>

    </div>
  );
}