import GlassPanel from "@/components/ui/GlassPanel";

export default function SuggestedImprovementCard() {


  const suggestions = [];


  return (

    <GlassPanel className="p-6 backdrop-blur-2xl">

      <h2 className="text-xl font-bold text-foreground">

        Suggested Improvements

      </h2>

      <div className="mt-6">

        {suggestions.length > 0 ? (
          <div className="space-y-4">
            {suggestions.map(
              (item, index) => (

                <div
                  key={index}
                  className="rounded-lg border border-border bg-card/60 p-4 text-sm text-muted-foreground"
                >

                  {item}

                </div>

              )
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No suggestions yet. Complete more trades to receive personalized improvement tips.</p>
        )}

      </div>

    </GlassPanel>
  );
}