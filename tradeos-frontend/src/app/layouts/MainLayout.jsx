import { useState } from "react";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useNotifications } from "@/hooks/useNotifications";

import Sidebar from "@/components/navigation/Sidebar";
import Topbar from "@/components/navigation/Topbar";
import BottomNav from "@/components/navigation/BottomNav";
import AiChatSidebar from "@/components/navigation/AiChatSidebar";
import ScrollToTop from "@/components/common/ScrollToTop";

export default function MainLayout({ children }) {
  useKeyboardShortcuts();
  useNotifications();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground grid-bg">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className={`min-h-screen flex flex-col transition-all duration-300 ${collapsed ? "lg:ml-[72px]" : "lg:ml-[240px]"}`}>
        <Topbar setMobileOpen={setMobileOpen} onAiChatToggle={() => setAiChatOpen((p) => !p)} />

        <main className="flex-1 p-4 md:p-6 pb-20 lg:pb-6 space-y-6">
          {children}
        </main>
      </div>

      <BottomNav />
      <ScrollToTop />

      <AiChatSidebar open={aiChatOpen} onClose={() => setAiChatOpen(false)} />
    </div>
  );
}
