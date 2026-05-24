export default function SuggestedImprovementCard() {

  const suggestions = [

    "Reduce overtrading after 3 consecutive wins.",

    "Focus more on breakout setups during London session.",

    "Avoid revenge entries after 2 losses in a row.",
  ];

  return (

    <div className="<GlassPanel /> p-6 backdrop-blur-2xl">

      <h2 className="text-xl font-bold text-white">

        Suggested Improvements

      </h2>

      <div className="mt-6 space-y-4">

        {suggestions.map(
          (item, index) => (

            <div
              key={index}
              className="rounded-2xl border border-white/5 bg-[#0B1120]/70 p-4 text-sm text-zinc-300"
            >

              {item}

            </div>

          )
        )}

      </div>

    </div>
  );
}