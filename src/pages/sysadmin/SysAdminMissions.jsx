import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Target, Search, Loader2, Power, CheckCircle } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from 'react-i18next';

export default function SysAdminMissions() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('active');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: missions, isLoading } = useQuery({
    queryKey: ['sysadmin-missions', search, activeTab],
    queryFn: async () => {
      let q = supabase
        .from('missions')
        .select(`
          *,
          business:businesses(name)
        `)
        .order('created_at', { ascending: false })
        .limit(50);
        
      if (search) {
        q = q.ilike('title', `%${search}%`);
      }
      
      const now = new Date().toISOString();

      if (activeTab === 'active') {
        q = q.eq('is_active', true).or(`expires_at.is.null,expires_at.gt.${now}`);
      } else if (activeTab === 'deactivated') {
        q = q.eq('is_active', false);
      } else if (activeTab === 'completed') {
        q = q.eq('is_active', true).lte('expires_at', now);
      }
      
      const { data, error } = await q;
      if (error) throw error;
      return data;
    }
  });

  const toggleMission = useMutation({
    mutationFn: async ({ id, is_active }) => {
      const { data, error } = await supabase
        .from('missions')
        .update({ is_active })
        .eq('id', id)
        .select();
      if (error) throw error;
      if (!data || data.length === 0) throw new Error("Update failed: no rows affected (possible permissions issue).");
      return data[0];
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['sysadmin-missions']);
      toast({ 
        title: data.is_active ? t("sysadmin.missions.toast.activated") : t("sysadmin.missions.toast.deactivated"), 
        className: 'bg-[#C8E650] text-black font-pixel' 
      });
    },
    onError: (err) => {
      toast({ title: t("sysadmin.missions.toast.updateFailed"), description: err.message, variant: 'destructive', className: 'font-pixel' });
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-[#A663E0]" />
          <h1 className="font-pixel text-xl text-foreground tracking-tight">
            {t("sysadmin.missions.title")}
          </h1>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t("sysadmin.missions.search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card border border-border pl-10 pr-4 py-3 font-body text-sm text-foreground focus:border-[#A663E0] focus:outline-none transition-colors"
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-card border border-border">
            <TabsTrigger value="active" className="font-pixel text-[10px] data-[state=active]:bg-[#4EE6D0]/10 data-[state=active]:text-[#4EE6D0]">{t("sysadmin.missions.tab.active")}</TabsTrigger>
            <TabsTrigger value="deactivated" className="font-pixel text-[10px] data-[state=active]:bg-[#E85D4A]/10 data-[state=active]:text-[#E85D4A]">{t("sysadmin.missions.tab.deactivated")}</TabsTrigger>
            <TabsTrigger value="completed" className="font-pixel text-[10px] data-[state=active]:bg-[#A663E0]/10 data-[state=active]:text-[#A663E0]">{t("sysadmin.missions.tab.completed")}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#A663E0]" />
        </div>
      ) : missions?.length === 0 ? (
        <div className="bg-card border border-border p-12 text-center text-muted-foreground font-pixel text-[10px]">
          {t("sysadmin.missions.noMissions")}
        </div>
      ) : (
        <div className="space-y-4">
          {missions?.map(mission => (
            <div key={mission.id} className={`bg-card border p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${mission.is_active ? 'border-border' : 'border-[#E85D4A]/30 opacity-70'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 border flex items-center justify-center ${mission.is_active ? 'bg-secondary/50 border-border text-[#4EE6D0]' : 'bg-[#E85D4A]/10 border-[#E85D4A]/30 text-[#E85D4A]'}`}>
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-pixel text-sm text-foreground">{mission.title}</h3>
                  <p className="font-body text-xs text-muted-foreground mt-1">
                    {mission.type} • {mission.xp_reward} {t("sysadmin.missions.xp")} • {mission.coin_reward} {t("sysadmin.missions.coins")}
                  </p>
                  <p className="font-body text-[10px] text-muted-foreground/70 mt-0.5">
                    {t("sysadmin.missions.by")} {mission.business?.name || t("sysadmin.missions.system")}
                  </p>
                </div>
              </div>
              
              {activeTab === 'completed' ? (
                <div className="flex items-center gap-2 px-4 py-2 border font-pixel text-[8px] bg-secondary/20 border-border text-muted-foreground cursor-not-allowed">
                  <CheckCircle className="w-3 h-3" />
                  {t("sysadmin.missions.completedBtn")}
                </div>
              ) : (
                <button
                  onClick={() => toggleMission.mutate({ id: mission.id, is_active: !mission.is_active })}
                  disabled={toggleMission.isPending}
                  className={`flex items-center gap-2 px-4 py-2 border font-pixel text-[8px] transition-colors ${
                    mission.is_active 
                      ? 'bg-[#E85D4A]/10 border-[#E85D4A]/50 text-[#E85D4A] hover:bg-[#E85D4A]/20' 
                      : 'bg-[#C8E650]/10 border-[#C8E650]/50 text-[#C8E650] hover:bg-[#C8E650]/20'
                  }`}
                >
                  <Power className="w-3 h-3" />
                  {mission.is_active ? t("sysadmin.missions.deactivateBtn") : t("sysadmin.missions.activateBtn")}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
