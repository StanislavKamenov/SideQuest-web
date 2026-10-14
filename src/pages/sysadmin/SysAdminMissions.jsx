import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Target, Search, Loader2, Power, CheckCircle, Plus, X, Zap, Gift, Sparkles } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/lib/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import MapPicker from '@/components/admin/MapPicker';

export default function SysAdminMissions() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('active');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rarity, setRarity] = useState('common');
  const [proofType, setProofType] = useState('photo');
  const [radius, setRadius] = useState(150);
  const [isCustomRadius, setIsCustomRadius] = useState(false);
  const [xpReward, setXpReward] = useState('50');
  const [coinsReward, setCoinsReward] = useState('100');
  const [startsAtDate, setStartsAtDate] = useState(() => {
    const d = new Date(Date.now() + 24 * 60 * 60 * 1000);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  });
  const [isActive, setIsActive] = useState(true);
  const [category, setCategory] = useState('event');
  const [isGlobal, setIsGlobal] = useState(false);
  const [isPremiumOnly, setIsPremiumOnly] = useState(false);
  const [durationHours, setDurationHours] = useState(24);
  const [isCustomDuration, setIsCustomDuration] = useState(false);
  const [location, setLocation] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  // Reward Config State
  const [rewardMode, setRewardMode] = useState('xp_coins'); // 'xp_coins' | 'custom_reward' | 'combined'
  const [rewardTitle, setRewardTitle] = useState('');
  const [rewardDescription, setRewardDescription] = useState('');
  const [rewardCodeType, setRewardCodeType] = useState('generated');
  const [sharedCode, setSharedCode] = useState('');
  const [uniqueCodes, setUniqueCodes] = useState('');
  const [maxTotal, setMaxTotal] = useState(1);
  const [maxPerUser, setMaxPerUser] = useState(1);
  const [isUnlimitedTotal, setIsUnlimitedTotal] = useState(true);
  const [isUnlimitedPerUser, setIsUnlimitedPerUser] = useState(false);
  
  const radiusOptions = [50, 100, 150, 300];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCoverImage({ file, url: imageUrl });
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!isGlobal && !location) {
      setFormError("Please select a location on the map.");
      return;
    }

    if (rewardMode === 'custom_reward' || rewardMode === 'combined') {
      if (!rewardTitle.trim()) {
        setFormError("Моля, въведете заглавие на наградата (напр. '20% намаление').");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      let cover_url = null;
      if (coverImage?.file) {
        const file = coverImage.file;
        const ext = file.name.split('.').pop() || 'jpg';
        const fileName = `${user.id}/covers/${Date.now()}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from('mission-media')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('mission-media')
          .getPublicUrl(fileName);

        cover_url = urlData.publicUrl;
      }

      const starts_at = isActive 
        ? new Date().toISOString() 
        : new Date(startsAtDate).toISOString();
      
      const expires_at = new Date(new Date(starts_at).getTime() + durationHours * 60 * 60 * 1000).toISOString();

      const isCustomReward = rewardMode === 'custom_reward';
      const finalXp = isCustomReward ? 0 : (parseInt(xpReward, 10) || 0);
      const finalCoins = isCustomReward ? 0 : (parseInt(coinsReward, 10) || 0);

      const missionData = {
        title,
        description,
        type: 'event',
        category,
        rarity,
        lat: isGlobal ? 0 : location.lat,
        lng: isGlobal ? 0 : location.lng,
        radius_m: isGlobal ? 0 : parseInt(radius),
        created_by: user.id,
        xp_reward: finalXp,
        coins_reward: finalCoins,
        is_active: true, // Always true so scheduled events show up in feed logic
        is_global: isGlobal,
        is_premium_only: isPremiumOnly,
        proof_upload_type: proofType,
        cover_url,
        starts_at,
        expires_at,
      };

      // AI Moderation check
      const { data: modData, error: modError } = await supabase.functions.invoke("moderate-mission", {
        body: { title, description: description || "" },
      });
      
      if (modError) {
        throw new Error(`The moderation server is temporarily unavailable. (${modError.message || 'unknown error'})`);
      }
      
      if (modData && !modData.safe) {
        throw new Error(modData.reason || "This content violates safety rules and cannot be saved.");
      }

      const { data: newMissions, error: insertError } = await supabase
        .from('missions')
        .insert(missionData)
        .select('id');

      if (insertError) throw insertError;
      const missionId = newMissions[0].id;

      if (rewardMode === 'custom_reward' || rewardMode === 'combined') {
        const rewardData = {
          kind: 'vip_deal',
          source: 'event',
          mission_id: missionId,
          business_id: null,
          partner_name: 'SideQuest',
          title: rewardTitle.trim() || title.trim() + ' Награда',
          description: rewardDescription.trim(),
          code_type: rewardCodeType,
          shared_code: rewardCodeType === 'shared' ? sharedCode.trim() : null,
          max_redemptions_total: isUnlimitedTotal ? null : parseInt(maxTotal),
          max_redemptions_per_user: isUnlimitedPerUser ? null : parseInt(maxPerUser),
          cost_coins: 0,
          cost_xp: 0,
          stock: 9999999,
          is_active: true,
        };

        const { data: newRewards, error: rewardError } = await supabase
          .from('rewards')
          .insert(rewardData)
          .select('id');

        if (rewardError) throw rewardError;

        if (newRewards?.length > 0 && rewardCodeType === 'unique') {
          const rewardId = newRewards[0].id;
          const codes = uniqueCodes.split(/[\n,]+/).map(c => c.trim()).filter(c => c.length > 0);
          if (codes.length > 0) {
            const uniqueCodesData = codes.map(c => ({
              reward_id: rewardId,
              business_id: null,
              code: c
            }));
            await supabase.from('reward_unique_codes').insert(uniqueCodesData);
            await supabase.from('rewards').update({ stock: codes.length }).eq('id', rewardId);
          }
        }
      }

      setShowCreateModal(false);
      setTitle('');
      setDescription('');
      setCoverImage(null);
      setLocation(null);
      setIsActive(true);
      const d = new Date(Date.now() + 24 * 60 * 60 * 1000);
      setStartsAtDate(new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16));
      setCategory('event');
      setIsGlobal(false);
      setIsPremiumOnly(false);
      setDurationHours(24);
      setXpReward('50');
      setCoinsReward('100');
      setRewardMode('xp_coins');
      setRewardTitle('');
      setRewardDescription('');
      setRewardCodeType('generated');
      setSharedCode('');
      setUniqueCodes('');
      setMaxTotal(1);
      setMaxPerUser(1);
      setIsUnlimitedTotal(true);
      setIsUnlimitedPerUser(false);
      setFormError(null);
      
      queryClient.invalidateQueries(['sysadmin-missions']);
      toast({ title: t("sysadmin.missions.toast.activated") || "Mission created", className: 'bg-[#C8E650] text-black font-pixel' });
    } catch (err) {
      console.error('Error creating event:', err);
      setFormError(err.message || 'Failed to create event.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const { data: missions, isLoading } = useQuery({
    queryKey: ['sysadmin-missions', search, activeTab],
    queryFn: async () => {
      let q = supabase
        .from('missions')
        .select(`
          *,
          business:businesses(name),
          rewards(id, title)
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
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-[#E85D4A] text-white px-4 py-2.5 font-pixel text-[8px] tracking-wider hover:bg-[#d44d3a] transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t("admin.events.createEventBtn") || "CREATE MISSION"}
        </button>
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
                  <p className="font-body text-xs text-muted-foreground mt-1 flex items-center gap-2 flex-wrap">
                    <span>{mission.type}</span>
                    <span>•</span>
                    <span>{mission.xp_reward} {t("sysadmin.missions.xp")}</span>
                    <span>•</span>
                    <span>{mission.coins_reward ?? 0} {t("sysadmin.missions.coins")}</span>
                    {mission.rewards?.[0] && (
                      <>
                        <span>•</span>
                        <span className="text-[#A78BFA] font-medium flex items-center gap-1">
                          🎁 {mission.rewards[0].title}
                        </span>
                      </>
                    )}
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

      {/* Create Event Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowCreateModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-xl bg-card border border-[#A663E0]/30 shadow-[0_0_30px_rgba(166,99,224,0.1)] p-6 z-10 overflow-y-auto max-h-[90vh] custom-scrollbar"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                <div>
                  <h2 className="font-pixel text-[12px] text-foreground tracking-widest glow-purple">{t("admin.events.createModal.title") || "CREATE MISSION"}</h2>
                  <p className="font-body text-xs text-muted-foreground mt-1">{t("admin.events.createModal.subtitle") || "Setup a new global or local mission"}</p>
                </div>
                <button onClick={() => setShowCreateModal(false)} className="text-muted-foreground hover:text-foreground bg-secondary/50 p-2">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form className="space-y-8" onSubmit={handleCreateEvent}>
                {formError && (
                  <div className="bg-red-500/10 border border-red-500/50 p-4">
                    <p className="font-pixel text-[8px] text-red-500 tracking-wider">ERROR: {formError}</p>
                  </div>
                )}

                {/* CATEGORY */}
                <div>
                  <label className="font-pixel text-[8px] text-[#A663E0] tracking-widest mb-3 block">{t("admin.events.createModal.categoryLabel") || "CATEGORY"}</label>
                  <p className="font-body text-[10px] text-muted-foreground mb-3">{t("admin.events.createModal.categoryDesc") || "Select the type of mission."}</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'global', label: 'Global Quest' },
                      { id: 'side', label: 'Side Quest' },
                      { id: 'event', label: 'Event' }
                    ].map(c => {
                      const isSelected = c.id === 'global' ? isGlobal : category === c.id;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => {
                            if (c.id === 'global') {
                              const next = !isGlobal;
                              setIsGlobal(next);
                              if (!next && category === 'global') setCategory('side');
                            } else {
                              if (category === c.id) {
                                setCategory('global');
                                setIsGlobal(true);
                              } else {
                                setCategory(c.id);
                              }
                            }
                          }}
                          className={`py-2 px-1 font-pixel text-[6px] tracking-wider border transition-all ${isSelected
                              ? 'bg-[#A663E0]/20 border-[#A663E0] text-[#A663E0] shadow-[0_0_10px_rgba(166,99,224,0.3)]'
                              : 'bg-secondary border-border text-muted-foreground hover:bg-secondary/80'
                            }`}
                        >
                          {c.label.toUpperCase()}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* PREMIUM ONLY */}
                <div>
                  <label className="font-pixel text-[8px] text-[#E8C36A] tracking-widest mb-3 block">PREMIUM</label>
                  <button
                    type="button"
                    onClick={() => setIsPremiumOnly(v => !v)}
                    className={`w-full flex items-center gap-3 py-3 px-4 border text-left transition-all ${isPremiumOnly
                        ? 'bg-[#E8C36A]/15 border-[#E8C36A] text-[#E8C36A] shadow-[0_0_10px_rgba(232,195,106,0.3)]'
                        : 'bg-secondary border-border text-muted-foreground hover:bg-secondary/80'
                      }`}
                  >
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span>
                      <span className="font-pixel text-[7px] tracking-wider block">PREMIUM ONLY MISSION</span>
                      <span className="font-body text-[10px] block mt-1">Only Premium players can join this mission.</span>
                    </span>
                  </button>
                </div>

                {/* RARITY */}
                <div>
                  <label className="font-pixel text-[8px] text-[#E8C36A] tracking-widest mb-3 block">{t("admin.events.createModal.rarityLabel") || "RARITY"}</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['common', 'rare', 'epic', 'legendary'].map(r => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRarity(r)}
                        className={`py-2 px-1 font-pixel text-[6px] tracking-wider border transition-all ${rarity === r
                            ? 'bg-[#E8C36A]/20 border-[#E8C36A] text-[#E8C36A] shadow-[0_0_10px_rgba(232,195,106,0.3)]'
                            : 'bg-secondary border-border text-muted-foreground hover:bg-secondary/80'
                          }`}
                      >
                        {r.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* BRIEFING */}
                <div>
                  <label className="font-pixel text-[8px] text-[#6B9FD4] tracking-widest mb-3 block">{t("admin.events.createModal.briefingLabel") || "MISSION BRIEFING"}</label>
                  <div className="space-y-4">
                    <div>
                      <span className="font-pixel text-[6px] text-muted-foreground tracking-widest block mb-1.5">TITLE</span>
                      <input
                        value={title} onChange={(e) => setTitle(e.target.value)} required
                        className="w-full bg-background border border-border px-4 py-2.5 font-body text-sm focus:border-[#6B9FD4] focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="font-pixel text-[6px] text-muted-foreground tracking-widest block mb-1.5">DESCRIPTION</span>
                      <textarea
                        value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
                        className="w-full bg-background border border-border px-4 py-2.5 font-body text-sm focus:border-[#6B9FD4] focus:outline-none resize-none"
                      />
                    </div>
                    <div>
                      <span className="font-pixel text-[6px] text-muted-foreground tracking-widest block mb-1.5">COVER IMAGE</span>
                      {coverImage ? (
                        <div className="relative w-full h-32 group">
                          <img
                            src={coverImage.url}
                            alt="Cover Preview"
                            className="w-full h-full object-cover border border-[#6B9FD4]/50"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => setCoverImage(null)}
                              className="bg-red-500/80 text-white px-3 py-1.5 font-pixel text-[6px] tracking-wider hover:bg-red-500"
                            >
                              REMOVE
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label className="w-full h-24 bg-background border border-border border-dashed flex flex-col items-center justify-center text-muted-foreground hover:bg-secondary/50 cursor-pointer transition-colors">
                          <span className="text-xl mb-1">📸</span>
                          <span className="font-pixel text-[6px] tracking-wider">CLICK TO UPLOAD</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                {/* PROOF */}
                <div>
                  <label className="font-pixel text-[8px] text-[#5DE8A4] tracking-widest mb-3 block">{t("admin.events.createModal.proofLabel") || "PROOF REQUIREMENT"}</label>
                  <div className="flex gap-3">
                    {[
                      { id: 'photo', label: 'Photo', icon: '📷' },
                      { id: 'video', label: 'Video', icon: '🎥' },
                      { id: 'both', label: 'Both', icon: '📸' }
                    ].map(opt => (
                      <button
                        key={opt.id} type="button" onClick={() => setProofType(opt.id)}
                        className={`flex-1 py-3 px-2 flex items-center justify-center gap-2 border transition-all ${proofType === opt.id
                            ? 'bg-[#5DE8A4]/10 border-[#5DE8A4] text-[#5DE8A4]'
                            : 'bg-secondary border-border text-muted-foreground'
                          }`}
                      >
                        <span>{opt.icon}</span>
                        <span className="font-pixel text-[7px] tracking-wider">{opt.label.toUpperCase()}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* LOCATION */}
                {!isGlobal && (
                  <div>
                    <label className="font-pixel text-[8px] text-[#D47BA8] tracking-widest mb-3 block">LOCATION</label>
                    <MapPicker onLocationSelect={(pos) => setLocation(pos)} />
                  </div>
                )}

                {/* RADIUS */}
                {!isGlobal && (
                  <div>
                    <label className="font-pixel text-[8px] text-[#D47BA8] tracking-widest mb-3 block">RADIUS (METERS)</label>
                    <div className="flex flex-wrap gap-2">
                      {radiusOptions.map(r => (
                        <button
                          key={r} type="button"
                          onClick={() => { setIsCustomRadius(false); setRadius(r); }}
                          className={`py-2 px-3 font-pixel text-[7px] tracking-wider border transition-all ${!isCustomRadius && radius === r
                              ? 'bg-[#D47BA8]/20 border-[#D47BA8] text-[#D47BA8]'
                              : 'bg-secondary border-border text-muted-foreground'
                            }`}
                        >
                          {r}m
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setIsCustomRadius(true)}
                        className={`py-2 px-3 font-pixel text-[7px] tracking-wider border transition-all ${isCustomRadius
                            ? 'bg-[#D47BA8]/20 border-[#D47BA8] text-[#D47BA8]'
                            : 'bg-secondary border-border text-muted-foreground'
                          }`}
                      >
                        CUSTOM
                      </button>
                    </div>
                    {isCustomRadius && (
                      <div className="mt-3">
                        <input
                          type="number" value={radius} onChange={(e) => setRadius(Number(e.target.value))}
                          className="w-full max-w-[200px] bg-background border border-border px-4 py-2 font-body text-sm focus:border-[#D47BA8] focus:outline-none"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* DURATION */}
                <div>
                  <label className="font-pixel text-[8px] text-[#E86A6A] tracking-widest mb-3 block">DURATION</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: '1h', value: 1 },
                      { label: '12h', value: 12 },
                      { label: '24h', value: 24 },
                      { label: '3d', value: 72 },
                      { label: '1w', value: 168 }
                    ].map(opt => (
                      <button
                        key={opt.label} type="button"
                        onClick={() => { setIsCustomDuration(false); setDurationHours(opt.value); }}
                        className={`py-2 px-3 font-pixel text-[7px] tracking-wider border transition-all ${!isCustomDuration && durationHours === opt.value
                            ? 'bg-[#E86A6A]/20 border-[#E86A6A] text-[#E86A6A]'
                            : 'bg-secondary border-border text-muted-foreground'
                          }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setIsCustomDuration(true)}
                      className={`py-2 px-3 font-pixel text-[7px] tracking-wider border transition-all ${isCustomDuration
                          ? 'bg-[#E86A6A]/20 border-[#E86A6A] text-[#E86A6A]'
                          : 'bg-secondary border-border text-muted-foreground'
                        }`}
                    >
                      +
                    </button>
                  </div>
                  {isCustomDuration && (
                    <div className="mt-3">
                      <input
                        type="number" value={durationHours} onChange={(e) => setDurationHours(Number(e.target.value))}
                        className="w-full max-w-[200px] bg-background border border-border px-4 py-2 font-body text-sm focus:border-[#E86A6A] focus:outline-none"
                      />
                    </div>
                  )}
                </div>

                {/* REWARD CONFIGURATION */}
                <div>
                  <label className="font-pixel text-[8px] text-[#A78BFA] tracking-widest mb-3 block">
                    НАГРАДА ПРИ ИЗПЪЛНЕНИЕ
                  </label>
                  <p className="font-body text-xs text-muted-foreground mb-4">
                    Изберете дали мисията да дава XP & Монети, Директна награда (ваучер/промо код), или и двете комбинирано.
                  </p>

                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <button
                      type="button"
                      onClick={() => setRewardMode('xp_coins')}
                      className={`p-4 border transition-all text-left flex flex-col justify-between ${
                        rewardMode === 'xp_coins'
                          ? 'bg-[#E8C36A]/10 border-[#E8C36A] text-[#E8C36A]'
                          : 'bg-secondary/40 border-border text-muted-foreground hover:border-border/80'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Zap size={16} className={rewardMode === 'xp_coins' ? 'text-[#E8C36A]' : 'text-muted-foreground'} />
                        <span className="font-pixel text-[9px] tracking-wider">XP & МОНЕТИ</span>
                      </div>
                      <span className="font-body text-[11px] opacity-70">
                        Без промо код
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRewardMode('custom_reward')}
                      className={`p-4 border transition-all text-left flex flex-col justify-between ${
                        rewardMode === 'custom_reward'
                          ? 'bg-[#A78BFA]/10 border-[#A78BFA] text-[#A78BFA]'
                          : 'bg-secondary/40 border-border text-muted-foreground hover:border-border/80'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Gift size={16} className={rewardMode === 'custom_reward' ? 'text-[#A78BFA]' : 'text-muted-foreground'} />
                        <span className="font-pixel text-[9px] tracking-wider">ДИРЕКТНА НАГРАДА</span>
                      </div>
                      <span className="font-body text-[11px] opacity-70">
                        Ваучер (0 XP & 0 Coins)
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRewardMode('combined')}
                      className={`p-4 border transition-all text-left flex flex-col justify-between ${
                        rewardMode === 'combined'
                          ? 'bg-[#5DE8A4]/10 border-[#5DE8A4] text-[#5DE8A4]'
                          : 'bg-secondary/40 border-border text-muted-foreground hover:border-border/80'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles size={16} className={rewardMode === 'combined' ? 'text-[#5DE8A4]' : 'text-muted-foreground'} />
                        <span className="font-pixel text-[9px] tracking-wider">КОМБИНИРАНО</span>
                      </div>
                      <span className="font-body text-[11px] opacity-70">
                        И двете заедно!
                      </span>
                    </button>
                  </div>

                  {(rewardMode === 'xp_coins' || rewardMode === 'combined') && (
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <span className="font-pixel text-[6px] text-muted-foreground tracking-widest block mb-1.5">XP REWARD</span>
                        <input
                          type="number" value={xpReward} onChange={(e) => setXpReward(e.target.value)}
                          className="w-full bg-background border border-border px-4 py-2.5 font-body text-sm focus:border-[#E8C36A] focus:outline-none"
                        />
                      </div>
                      <div>
                        <span className="font-pixel text-[6px] text-muted-foreground tracking-widest block mb-1.5">COINS REWARD</span>
                        <input
                          type="number" value={coinsReward} onChange={(e) => setCoinsReward(e.target.value)}
                          className="w-full bg-background border border-border px-4 py-2.5 font-body text-sm focus:border-[#E8C36A] focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {(rewardMode === 'custom_reward' || rewardMode === 'combined') && (
                    <div className={`space-y-4 p-4 border bg-background mb-6 ${rewardMode === 'combined' ? 'border-[#5DE8A4]/30' : 'border-[#A78BFA]/30'}`}>
                      <div className={`p-3 border flex items-center gap-2 text-xs ${rewardMode === 'combined' ? 'bg-[#5DE8A4]/10 border-[#5DE8A4]/20 text-[#5DE8A4]' : 'bg-[#A78BFA]/10 border-[#A78BFA]/20 text-[#A78BFA]'}`}>
                        <Gift size={16} className="shrink-0" />
                        <span>
                          {rewardMode === 'combined'
                            ? "Играчите получават посочените XP и монети, ЗАЕДНО с тази награда с код в „Моите купони“ при изпълнение!"
                            : "Играчите получават тази награда с код автоматично в „Моите купони“ при изпълнение (0 XP и 0 монети)."}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="font-pixel text-[6px] text-muted-foreground tracking-widest block mb-1.5">ЗАГЛАВИЕ НА НАГРАДАТА</span>
                          <input
                            value={rewardTitle} onChange={(e) => setRewardTitle(e.target.value)}
                            className="w-full bg-background border border-border px-4 py-2 font-body text-sm focus:border-[#A78BFA] focus:outline-none"
                            placeholder="напр. 20% Намаление на цялата сметка"
                          />
                        </div>
                        <div>
                          <span className="font-pixel text-[6px] text-muted-foreground tracking-widest block mb-1.5">ОПИСАНИЕ / УСЛОВИЯ (ПО ИЗБОР)</span>
                          <input
                            value={rewardDescription} onChange={(e) => setRewardDescription(e.target.value)}
                            className="w-full bg-background border border-border px-4 py-2 font-body text-sm focus:border-[#A78BFA] focus:outline-none"
                            placeholder="напр. Важи при поръчка на място"
                          />
                        </div>
                      </div>

                      <div>
                        <span className="font-pixel text-[6px] text-muted-foreground tracking-widest block mb-1.5">ТИП ПРОМО КОД</span>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { id: 'generated', label: 'Генериран', desc: 'Автоматичен уникален код' },
                            { id: 'shared', label: 'Споделен', desc: 'Един код за всички (напр. PROMO20)' },
                            { id: 'unique', label: 'Списък с кодове', desc: 'Списък от предварително въведени кодове' }
                          ].map(t => (
                            <button
                              key={t.id} type="button" onClick={() => setRewardCodeType(t.id)}
                              className={`p-2 border transition-all text-left ${rewardCodeType === t.id
                                  ? 'bg-[#A78BFA]/10 border-[#A78BFA] text-[#A78BFA]'
                                  : 'bg-secondary border-border text-muted-foreground'
                                }`}
                            >
                              <div className="font-pixel text-[7px] tracking-wider mb-1">{t.label.toUpperCase()}</div>
                              <div className="font-body text-[9px] opacity-70">{t.desc}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {rewardCodeType === 'shared' && (
                        <div>
                          <span className="font-pixel text-[6px] text-muted-foreground tracking-widest block mb-1.5">СПОДЕЛЕН ПРОМО КОД</span>
                          <input
                            value={sharedCode} onChange={(e) => setSharedCode(e.target.value)} required
                            className="w-full bg-background border border-border px-4 py-2 font-body text-sm focus:border-[#A78BFA] focus:outline-none uppercase"
                            placeholder="напр. DISCOUNT20"
                          />
                        </div>
                      )}

                      {rewardCodeType === 'unique' && (
                        <div>
                          <span className="font-pixel text-[6px] text-muted-foreground tracking-widest block mb-1.5">УНИКАЛНИ ПРОМО КОДОВЕ</span>
                          <textarea
                            value={uniqueCodes} onChange={(e) => setUniqueCodes(e.target.value)} required rows={4}
                            className="w-full bg-background border border-border px-4 py-2 font-body text-sm focus:border-[#A78BFA] focus:outline-none resize-none"
                            placeholder="Постави кодовете, разделени със запетая или нов ред"
                          />
                        </div>
                      )}

                      <div className="pt-2 border-t border-border mt-4">
                        <span className="font-pixel text-[6px] text-muted-foreground tracking-widest block mb-3">ЛИМИТИ ЗА ИЗПОЛЗВАНЕ</span>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-pixel text-[6px] text-muted-foreground tracking-widest block">ОБЩ БРОЙ</span>
                              <label className="flex items-center gap-1 cursor-pointer">
                                <input type="checkbox" checked={isUnlimitedTotal} onChange={(e) => setIsUnlimitedTotal(e.target.checked)} className="rounded bg-background border-border" />
                                <span className="font-pixel text-[6px] text-muted-foreground">НЕОГРАНИЧЕН</span>
                              </label>
                            </div>
                            <input
                              type="number" value={maxTotal} onChange={(e) => setMaxTotal(e.target.value)} disabled={isUnlimitedTotal} min="1"
                              className="w-full bg-background border border-border px-4 py-2 font-body text-sm focus:border-[#A78BFA] focus:outline-none disabled:opacity-50"
                            />
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-pixel text-[6px] text-muted-foreground tracking-widest block">МАКСИМУМ ЗА ПОТРЕБИТЕЛ</span>
                              <label className="flex items-center gap-1 cursor-pointer">
                                <input type="checkbox" checked={isUnlimitedPerUser} onChange={(e) => setIsUnlimitedPerUser(e.target.checked)} className="rounded bg-background border-border" />
                                <span className="font-pixel text-[6px] text-muted-foreground">НЕОГРАНИЧЕНО</span>
                              </label>
                            </div>
                            <input
                              type="number" value={maxPerUser} onChange={(e) => setMaxPerUser(e.target.value)} disabled={isUnlimitedPerUser} min="1"
                              className="w-full bg-background border border-border px-4 py-2 font-body text-sm focus:border-[#A78BFA] focus:outline-none disabled:opacity-50"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                  <div className={`p-4 border transition-all flex flex-col mt-4 ${isActive ? 'border-[#6B9FD4]/50 bg-[#6B9FD4]/5' : 'border-border bg-secondary/30'}`}>
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <p className="font-pixel text-[8px] text-foreground tracking-wider">ACTIVE STATUS</p>
                        <p className="font-body text-[10px] text-muted-foreground mt-1">If active, the mission starts immediately. Otherwise, schedule a start time.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                        <div className="w-9 h-5 bg-secondary peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#6B9FD4] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#6B9FD4]"></div>
                      </label>
                    </div>

                    {!isActive && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <label className="font-pixel text-[6px] text-muted-foreground tracking-widest block mb-2">
                          SCHEDULED START TIME
                        </label>
                        <input
                          type="datetime-local"
                          value={startsAtDate}
                          onChange={(e) => setStartsAtDate(e.target.value)}
                          className="w-full bg-background border border-border px-3 py-2 font-body text-sm focus:border-[#6B9FD4] focus:outline-none"
                        />
                      </div>
                    )}
                  </div>

                {/* SUBMIT */}
                <div className="pt-6 border-t border-border">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#A663E0] text-white py-4 font-pixel text-[10px] tracking-widest hover:bg-[#9149c4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(166,99,224,0.3)]"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        CREATING...
                      </>
                    ) : (
                      'CREATE MISSION'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
