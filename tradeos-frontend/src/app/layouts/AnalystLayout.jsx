export default function AnalystLayout({
  children,
}) {

  return (

    <div className="min-h-screen bg-background text-foreground">

      <div className="border-b border-border p-5 text-xl font-bold">

        Analyst Workspace

      </div>

      <div className="p-6">

        {children}

      </div>

    </div>
  );
}