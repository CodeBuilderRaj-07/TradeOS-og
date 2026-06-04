export default function TradeMessage({
  message,
}) {

  if (!message) return null;

  return (

    <div className="rounded-lg border border-primary/10 bg-primary/10 p-4 text-sm text-blue-300">

      {message}

    </div>
  );
}