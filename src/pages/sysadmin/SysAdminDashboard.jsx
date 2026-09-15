import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { Users, Building2, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function SysAdminDashboard() {
  const { t } = useTranslation();
  const { data: stats, isLoading } = useQuery({
    queryKey: ['sysadmin-stats'],
    queryFn: async () => {
      const [users, businesses, missions] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('businesses').select('id', { count: 'exact', head: true }).eq('status', 'pending_review'),
        supabase.from('missions').select('id', { count: 'exact', head: true }).eq('is_active', true)
      ]);
      return {
        totalUsers: users.count || 0,
        pendingBusinesses: businesses.count || 0,
        activeMissions: missions.count || 0
      };
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#A663E0]/30 border-t-[#A663E0] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-2 h-8 bg-[#A663E0]" />
        <h1 className="font-pixel text-xl text-foreground tracking-tight" style={{ textShadow: '0 0 10px rgba(166, 99, 224, 0.5)' }}>
          {t("sysadmin.dashboard.title")}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users className="w-24 h-24 text-[#4EE6D0]" />
          </div>
          <div className="relative z-10">
            <h3 className="font-pixel text-[10px] text-muted-foreground tracking-widest mb-4">{t("sysadmin.dashboard.totalPlayers")}</h3>
            <p className="font-pixel text-4xl text-foreground">{stats?.totalUsers || 0}</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card border border-border p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Building2 className="w-24 h-24 text-[#E85D4A]" />
          </div>
          <div className="relative z-10">
            <h3 className="font-pixel text-[10px] text-muted-foreground tracking-widest mb-4">{t("sysadmin.dashboard.pendingBusinesses")}</h3>
            <p className="font-pixel text-4xl text-foreground">{stats?.pendingBusinesses || 0}</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card border border-border p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Target className="w-24 h-24 text-[#C8E650]" />
          </div>
          <div className="relative z-10">
            <h3 className="font-pixel text-[10px] text-muted-foreground tracking-widest mb-4">{t("sysadmin.dashboard.activeMissions")}</h3>
            <p className="font-pixel text-4xl text-foreground">{stats?.activeMissions || 0}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
