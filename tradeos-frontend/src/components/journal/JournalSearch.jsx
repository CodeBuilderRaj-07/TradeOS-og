import { Search }
  from "lucide-react";

export default function JournalSearch() {

  return (

    <div className="flex h-12 w-full items-center gap-3 rounded-lg border border-border bg-card/30 px-4 backdrop-blur-xl lg:w-[260px]">

      <Search
        size={16}
        className="text-muted-foreground"
      />

      <input
        placeholder="Search journal..."
        className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
      />

    </div>
  );
}