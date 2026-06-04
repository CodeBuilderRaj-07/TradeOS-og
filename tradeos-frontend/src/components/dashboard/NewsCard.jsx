import GlassPanel from "@/components/ui/GlassPanel"
import { Newspaper }
  from "lucide-react";

export default function NewsCard({
  news,
}) {

  return (

    <GlassPanel className="p-5 backdrop-blur-2xl">

      <div className="mb-5 flex items-center gap-3">

        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">

          <Newspaper size={20} />

        </div>

        <div>

          <h3 className="text-sm font-semibold text-foreground">

            Market News

          </h3>

          <p className="text-xs text-muted-foreground">

            Latest updates

          </p>

        </div>

      </div>

      <div className="space-y-4">

        {news.map((item, index) => (

          <div
            key={index}
            className="border-b border-border pb-4 last:border-none"
          >

            <h4 className="text-sm font-medium leading-6 text-zinc-200">

              {item.title}

            </h4>

            <p className="mt-2 text-xs text-muted-foreground">

              {item.source?.name}

            </p>

          </div>

        ))}

      </div>

    </GlassPanel>
  );
}