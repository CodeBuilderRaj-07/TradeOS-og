import JournalHeader
  from "@/components/journal/JournalHeader";

import JournalEntryCard
  from "@/components/journal/JournalEntryCard";

import JournalStatsCard
  from "@/components/journal/JournalStatsCard";

import JournalFormCard
  from "@/components/journal/JournalFormCard";

import AiJournalCoachCard
  from "@/components/journal/AiJournalCoachCard";

import JournalSearch
  from "@/components/journal/JournalSearch";

import JournalEmpty
  from "@/components/journal/JournalEmpty";

import {
  useJournal,
} from "@/hooks/useJournal";

import GlassPanel
  from "@/components/ui/GlassPanel";

export default function Journal() {

  const {
    journals,
    loading,
    formData,
    setFormData,
    handleChange,
    createJournal,
  } = useJournal();

  if (loading) {

    return (

      <div className="flex min-h-[60vh] items-center justify-center">

        <div className="h-12 w-12 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />

      </div>
    );
  }

  return (

    <div className="space-y-6">

      <JournalHeader />

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.4fr_0.8fr]">

        {/* Left */}
        <GlassPanel className="p-6">

          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <h3 className="text-lg font-bold text-white">

                Your Journal Entries

              </h3>

              <p className="mt-1 text-sm text-zinc-500">

                Real trading psychology tracking

              </p>

            </div>

            <JournalSearch />

          </div>

          {journals.length === 0 && (
            <JournalEmpty />
          )}

          <div className="space-y-4">

            {journals.map((entry) => (

              <JournalEntryCard
                key={entry.id}
                entry={entry}
              />

            ))}

          </div>

        </GlassPanel>

        {/* Right */}
        <div className="space-y-4">

          <JournalStatsCard
            journals={journals}
          />

          <JournalFormCard
            formData={formData}
            handleChange={handleChange}
            createJournal={createJournal}
          />

          <AiJournalCoachCard />

        </div>

      </section>

    </div>
  );
}