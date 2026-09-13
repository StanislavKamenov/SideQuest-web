import React from 'react';
import { motion } from 'framer-motion';
import {
  CalendarDays,
  Gift,
  Clock,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/lib/AuthContext';

function KPICard({ label, value, icon: Icon, color, index, isLoading }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-card border border-border p-5 relative group hover:border-opacity-60 transition-all"
      style={{ '--kpi-color': color }}
    >
      <div className="absolute top-0 left-0 w-full h-0.5" style={{ backgroundColor: color, opacity: 0.6 }} />
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 flex items-center justify-center border-2"
          style={{ borderColor: color + '44', backgroundColor: color + '11' }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>
      {isLoading ? (
        <div className="h-[28px] md:h-[36px] flex items-center mb-1">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <p className="font-pixel text-[clamp(1rem,2.5vw,1.5rem)] text-foreground mb-1" style={{ textShadow: `0 0 12px ${color}44` }}>
          {value}
        </p>
      )}
      <p className="font-pixel text-[6px] text-muted-foreground tracking-widest">{label}</p>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const { user } = useAuth();

  // 1. Fetch Business ID
  const { data: business, isLoading: isLoadingBusiness, error: businessError } = useQuery({
    queryKey: ['admin-business', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('businesses')
        .select('id, name')
        .eq('owner_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const businessId = business?.id;

  // 2. Fetch Dashboard Metrics
  const { data: metrics, isLoading: isLoadingMetrics, error: metricsError } = useQuery({
    queryKey: ['admin-dashboard-metrics', businessId],
    queryFn: async () => {
      // Fetch Active Events count
      const { count: activeEventsCount, error: eventsError } = await supabase
        .from('missions')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', businessId)
        .eq('is_active', true)
        .eq('category', 'event');

      if (eventsError) throw eventsError;

      // Fetch Redemptions count (used)
      // Since redemptions doesn't have business_id directly, we must join with rewards
      const { data: redemptionsData, error: redemptionsError } = await supabase
        .from('redemptions')
        .select(`
          id,
          rewards!inner(business_id)
        `)
        .eq('status', 'used')
        .eq('rewards.business_id', businessId);

      if (redemptionsError) throw redemptionsError;
      const redemptionsCount = redemptionsData.length;

      // Fetch Recent Activity (latest 5 used redemptions)
      const { data: recentRedemptions, error: recentError } = await supabase
        .from('redemptions')
        .select(`
          id,
          used_at,
          status,
          user:profiles!redemptions_user_id_fkey(username, display_name),
          reward:rewards!inner(title, business_id)
        `)
        .eq('rewards.business_id', businessId)
        .eq('status', 'used')
        .order('used_at', { ascending: false })
        .limit(5);

      if (recentError) throw recentError;

      return {
        activeEvents: activeEventsCount || 0,
        totalRedemptions: redemptionsCount || 0,
        recentActivity: recentRedemptions || [],
      };
    },
    enabled: !!businessId,
  });

  if (businessError || metricsError) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-card border border-destructive/50">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="font-pixel text-sm text-foreground mb-2">ERROR LOADING DASHBOARD</h2>
        <p className="font-body text-sm text-muted-foreground">{businessError?.message || metricsError?.message}</p>
      </div>
    );
  }

  if (!isLoadingBusiness && !business) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-card border border-border">
        <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
        <h2 className="font-pixel text-sm text-foreground mb-2">NO BUSINESS FOUND</h2>
        <p className="font-body text-sm text-muted-foreground">It seems you don't have a registered business profile.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-pixel text-[clamp(0.7rem,2vw,1rem)] text-foreground glow-red mb-2 leading-relaxed">
            DASHBOARD
          </h1>
          <p className="font-body text-sm text-muted-foreground">
            Welcome back, {business?.name || 'Partner'}! Here's what's happening with your business.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 border border-border px-3 py-2">
          <Clock className="w-3 h-3 text-muted-foreground" />
          <span className="font-pixel text-[7px] text-muted-foreground tracking-wider">
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </div>

      {/* KPI Grid - Adjusted to remove financial data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <KPICard
          label="ACTIVE EVENTS"
          value={metrics?.activeEvents}
          icon={CalendarDays}
          color="#E85D4A"
          index={0}
          isLoading={isLoadingMetrics}
        />
        <KPICard
          label="REDEMPTIONS"
          value={metrics?.totalRedemptions}
          icon={Gift}
          color="#6B9FD4"
          index={1}
          isLoading={isLoadingMetrics}
        />
      </div>

      {/* Recent Activity Row */}
      <div className="grid grid-cols-1 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border p-5"
        >
          <h2 className="font-pixel text-[9px] text-foreground tracking-wider mb-1">RECENT ACTIVITY</h2>
          <p className="font-body text-xs text-muted-foreground mb-4">Latest redemptions</p>
          
          {isLoadingMetrics ? (
            <div className="flex justify-center p-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : metrics?.recentActivity.length > 0 ? (
            <div className="space-y-3">
              {metrics.recentActivity.map((act) => {
                const displayName = act.user?.display_name || act.user?.username || 'Unknown User';
                const rewardTitle = act.reward?.title || 'Reward';
                const timeString = new Date(act.used_at).toLocaleString();
                
                return (
                  <div key={act.id} className="flex items-start gap-3 py-2 border-b border-border/50 last:border-0">
                    <span className="text-lg flex-shrink-0 mt-0.5">🎁</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-xs text-foreground leading-relaxed truncate">
                        <span className="font-semibold text-[#4EE6D0]">{displayName}</span> redeemed <span className="font-semibold">{rewardTitle}</span>
                      </p>
                      <p className="font-pixel text-[6px] text-muted-foreground mt-1 tracking-wider">{timeString}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="font-pixel text-[8px] text-muted-foreground tracking-wider">NO RECENT ACTIVITY</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
