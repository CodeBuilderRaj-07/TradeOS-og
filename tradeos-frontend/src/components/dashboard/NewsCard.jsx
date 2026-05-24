import { Newspaper }
  from "lucide-react";

export default function NewsCard({
  news,
}) {

  return (

    <div className="<GlassPanel /> p-5 backdrop-blur-2xl">

      <div className="mb-5 flex items-center gap-3">

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">

          <Newspaper size={20} />

        </div>

        <div>

          <h3 className="text-sm font-semibold text-white">

            Market News

          </h3>

          <p className="text-xs text-zinc-500">

            Latest updates

          </p>

        </div>

      </div>

      <div className="space-y-4">

        {news.map((item, index) => (

          <div
            key={index}
            className="border-b border-white/5 pb-4 last:border-none"
          >

            <h4 className="text-sm font-medium leading-6 text-zinc-200">

              {item.title}

            </h4>

            <p className="mt-2 text-xs text-zinc-500">

              {item.source?.name}

            </p>

          </div>

        ))}

      </div>

    </div>
  );
}