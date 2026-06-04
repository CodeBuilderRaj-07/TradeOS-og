import { motion } from "framer-motion";
import GlassPanel from "@/components/ui/GlassPanel";
import { Shield, Users, Activity, Settings } from "lucide-react";

const stats = [
  { title: "Total Users", value: "—", icon: Users, color: "text-blue-400" },
  { title: "Active Sessions", value: "—", icon: Activity, color: "text-emerald-400" },
  { title: "System Health", value: "Online", icon: Shield, color: "text-green-400" },
  { title: "Config", value: "Manage", icon: Settings, color: "text-purple-400" },
];

export default function AdminDashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-[1600px] mx-auto"
    >
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">System overview and management</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <GlassPanel key={stat.title} className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {stat.title}
              </p>
              <stat.icon size={18} className={stat.color} />
            </div>
            <h2 className={`mt-4 text-2xl font-bold tracking-tight ${stat.color}`}>
              {stat.value}
            </h2>
          </GlassPanel>
        ))}
      </div>

      <GlassPanel className="p-8 text-center">
        <Shield size={32} className="mx-auto text-muted-foreground mb-3" />
        <h2 className="text-lg font-bold text-foreground">Admin Console</h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
          User management, system monitoring, and platform configuration coming soon.
        </p>
      </GlassPanel>
    </motion.div>
  );
}
