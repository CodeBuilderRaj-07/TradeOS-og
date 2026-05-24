export default function TradeSkeleton() {

  return (

    <div className="<GlassPanel /> p-6">

      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">

        {/* Left */}
        <div className="flex items-center gap-4">

          <div className="skeleton h-14 w-14 rounded-2xl" />

          <div>

            <div className="skeleton h-5 w-24 rounded-full" />

            <div className="skeleton mt-3 h-4 w-20 rounded-full" />

          </div>

        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">

          {[...Array(4)].map(
            (_, index) => (

              <div key={index}>

                <div className="skeleton h-3 w-20 rounded-full" />

                <div className="skeleton mt-3 h-6 w-24 rounded-full" />

              </div>

            )
          )}

        </div>

        {/* Right */}
        <div className="skeleton h-12 w-12 rounded-2xl" />

      </div>

    </div>
  );
}