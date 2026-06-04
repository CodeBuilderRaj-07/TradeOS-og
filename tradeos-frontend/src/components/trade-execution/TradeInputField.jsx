export default function TradeInputField({
  label,
  name,
  value,
  onChange,
  placeholder,
}) {

  return (

    <div>

      <label className="text-sm text-muted-foreground">

        {label}

      </label>

      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="mt-2 w-full rounded-lg bg-card border border-border px-4 py-3 text-sm text-foreground outline-none focus:border-primary placeholder:text-muted-foreground"
      />

    </div>
  );
}