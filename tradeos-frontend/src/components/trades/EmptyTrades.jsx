import GlassPanel from "@/components/ui/GlassPanel";

export default function EmptyTrades() {

  return (

    <GlassPanel className="p-14 text-center">

      <h2 className="text-3xl font-bold text-foreground">

        No Open Trades

      </h2>

      <p className="mt-4 text-muted-foreground">

        Your active positions will appear here.

      </p>

    </GlassPanel>
  );
}