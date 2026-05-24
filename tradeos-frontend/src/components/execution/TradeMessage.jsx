export default function TradeMessage({
  message,
}) {

  const success =
    message.includes(
      "Successfully"
    );

  return (

    <div
      className={`rounded-2xl border px-5 py-4 text-sm font-semibold ${
        success
          ? "border-green-500/10 bg-green-500/10 text-green-400"
          : "border-red-500/10 bg-red-500/10 text-red-400"
      }`}
    >

      {message}

    </div>
  );
}