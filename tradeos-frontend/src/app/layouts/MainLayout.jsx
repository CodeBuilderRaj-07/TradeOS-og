import { useState } from "react";

import Sidebar
  from "@/components/navigation/Sidebar";

import Topbar
  from "@/components/navigation/Topbar";

export default function MainLayout({
  children,
}) {

  const [
    mobileOpen,
    setMobileOpen,
  ] = useState(false);

  return (

    <div className="min-h-screen bg-[#050816] text-white">

      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content */}
      <div className="min-h-screen lg:ml-[260px]">

        {/* Topbar */}
        <Topbar
          setMobileOpen={setMobileOpen}
        />

        {/* Page Content */}
        <main className="p-4 sm:p-5 lg:p-6">

          {children}

        </main>

      </div>

    </div>
  );
}