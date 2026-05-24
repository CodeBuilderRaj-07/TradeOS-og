export default function TradeInputField({
  label,
  name,
  value,
  onChange,
  placeholder,
}) {

  return (

    <div>

      <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">

        {label}

      </label>

      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="h-12 w-full rounded-2xl border border-white/5 bg-[#0B1120]/70 px-4 text-sm text-white outline-none transition-all focus:border-blue-500/20"
      />

    </div>
  );
}