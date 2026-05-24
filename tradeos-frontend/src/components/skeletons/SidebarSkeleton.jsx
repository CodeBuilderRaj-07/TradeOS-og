export default function SidebarSkeleton() {

  return (

    <aside className="fixed left-0 top-0 flex h-screen w-[220px] flex-col border-r border-white/5 bg-[#050816] p-4">

      {/* Logo */}
      <div className="mb-10 flex items-center gap-3">

        <div className="skeleton h-12 w-12 rounded-2xl" />

        <div>

          <div className="skeleton h-5 w-24 rounded-full" />

          <div className="skeleton mt-2 h-3 w-16 rounded-full" />

        </div>

      </div>

      {/* Navigation */}
      <div className="space-y-3">

        {[...Array(8)].map(
          (_, index) => (

            <div
              key={index}
              className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.02] px-4 py-3"
            >

              <div className="skeleton h-10 w-10 rounded-xl" />

              <div className="skeleton h-4 w-24 rounded-full" />

            </div>

          )
        )}

      </div>

      {/* Bottom Profile */}
      <div className="mt-auto <GlassPanel /> p-4">

        <div className="flex items-center gap-3">

          <div className="skeleton h-12 w-12 rounded-2xl" />

          <div className="flex-1">

            <div className="skeleton h-4 w-28 rounded-full" />

            <div className="skeleton mt-2 h-3 w-20 rounded-full" />

          </div>

        </div>

      </div>

    </aside>
  );
}