export default function TableSkeleton({
  rows = 5,
}) {

  return (

    <div className="overflow-hidden <GlassPanel />">

      {/* Header */}
      <div className="grid grid-cols-5 gap-4 border-b border-border p-5">

        {[...Array(5)].map(
          (_, index) => (

            <div
              key={index}
              className="skeleton h-4 w-24 rounded-full"
            />

          )
        )}

      </div>

      {/* Rows */}
      {[...Array(rows)].map(
        (_, index) => (

          <div
            key={index}
            className="grid grid-cols-5 gap-4 border-b border-border p-5"
          >

            {[...Array(5)].map(
              (_, colIndex) => (

                <div
                  key={colIndex}
                  className="skeleton h-5 w-24 rounded-full"
                />

              )
            )}

          </div>

        )
      )}

    </div>
  );
}