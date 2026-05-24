import MetricCardSkeleton
  from "./MetricCardSkeleton";

import ChartSkeleton
  from "./ChartSkeleton";

export default function DashboardSkeleton() {

  return (

    <div className="space-y-6">

      {/* Header */}
      <div>

        <div className="skeleton h-10 w-56 rounded-xl" />

        <div className="skeleton mt-3 h-4 w-72 rounded-full" />

      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {[...Array(4)].map(
          (_, index) => (

            <MetricCardSkeleton
              key={index}
            />

          )
        )}

      </div>

      {/* Chart */}
      <ChartSkeleton />

    </div>
  );
}