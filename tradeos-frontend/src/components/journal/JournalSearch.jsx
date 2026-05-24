import { Search }
  from "lucide-react";

export default function JournalSearch() {

  return (

    <div className="flex h-12 w-full items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] px-4 backdrop-blur-xl lg:w-[260px]">

      <Search
        size={16}
        className="text-zinc-500"
      />

      <input
        placeholder="Search journal..."
        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
      />

    </div>
  );
}