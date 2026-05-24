export default function AIInsightsHeader() {

  return (

    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

      <div>

        <h1 className="text-3xl font-bold tracking-tight text-white lg:text-4xl">

          AI Insights

        </h1>

        <p className="mt-2 text-sm text-zinc-500">

          AI-powered trading behavior analysis

        </p>

      </div>

      <button className="h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_35px_rgba(37,99,235,0.25)]">

        Generate Report

      </button>

    </div>
  );
}