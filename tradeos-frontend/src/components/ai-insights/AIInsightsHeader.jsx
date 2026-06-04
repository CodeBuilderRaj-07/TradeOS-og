export default function AIInsightsHeader() {

  return (

    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

      <div>

        <h1 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl">

          AI Insights

        </h1>

        <p className="mt-2 text-sm text-muted-foreground">

          AI-powered trading behavior analysis

        </p>

      </div>

      <button className="h-12 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors">

        Generate Report

      </button>

    </div>
  );
}