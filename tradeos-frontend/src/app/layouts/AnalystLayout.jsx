export default function AnalystLayout({
  children,
}) {

  return (

    <div className="min-h-screen bg-[#050816] text-white">

      <div className="border-b border-white/5 p-5 text-xl font-bold">

        Analyst Workspace

      </div>

      <div className="p-6">

        {children}

      </div>

    </div>
  );
}