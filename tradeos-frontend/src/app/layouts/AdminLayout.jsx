export default function AdminLayout({
  children,
}) {

  return (

    <div className="min-h-screen bg-black text-white">

      <div className="border-b border-white/10 p-5 text-xl font-bold">

        Admin Panel

      </div>

      <div className="p-6">

        {children}

      </div>

    </div>
  );
}