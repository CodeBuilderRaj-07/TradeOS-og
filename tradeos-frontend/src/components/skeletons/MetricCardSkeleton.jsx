export default function MetricCardSkeleton() {

  return (

    <div className="<GlassPanel /> p-5">

      <div className="flex items-center justify-between">

        <div className="skeleton h-3 w-24 rounded-full" />

        <div className="skeleton h-11 w-11 rounded-2xl" />

      </div>

      <div className="skeleton mt-6 h-10 w-32 rounded-xl" />

      <div className="skeleton mt-4 h-3 w-28 rounded-full" />

    </div>
  );
}