export default function TradeNotesField({
  value,
  onChange,
}) {

  return (

    <div className="mt-4">

      <label className="text-sm text-muted-foreground">

        Trade Notes

      </label>

      <textarea
        name="notes"
        value={value}
        onChange={onChange}
        placeholder="Write your trade plan, emotions, reasoning..."
        className="mt-2 w-full h-28 rounded-lg bg-card border border-border p-3 text-sm text-foreground outline-none focus:border-primary placeholder:text-muted-foreground resize-none"
      />

    </div>
  );
}