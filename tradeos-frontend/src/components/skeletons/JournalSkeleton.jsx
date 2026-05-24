export default function JournalSkeleton() {

  return (

    <div className="space-y-6">

      {/* Header */}
      <div>

        <div className="skeleton h-10 w-60 rounded-xl" />

        <div className="skeleton mt-3 h-4 w-72 rounded-full" />

      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.4fr_0.8fr]">

        {/* Left */}
        <div className="<GlassPanel /> p-6">

          {[...Array(3)].map(
            (_, index) => (

              <div
                key={index}
                className="mb-4 rounded-2xl border border-white/5 bg-[#0B1120]/70 p-5"
              >

                <div className="skeleton h-5 w-40 rounded-full" />

                <div className="skeleton mt-4 h-4 w-32 rounded-full" />

                <div className="skeleton mt-6 h-20 w-full rounded-2xl" />

              </div>

            )
          )}

        </div>

        {/* Right */}
        <div className="space-y-4">

          {[...Array(3)].map(
            (_, index) => (

              <div
                key={index}
                className="<GlassPanel /> p-6"
              >

                <div className="skeleton h-5 w-40 rounded-full" />

                <div className="skeleton mt-6 h-28 w-full rounded-2xl" />

              </div>

            )
          )}

        </div>

      </div>

    </div>
  );
}