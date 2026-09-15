import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  MapPin,
  Users,
  Zap,
  X,
  Calendar,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { demoEvents } from '@/lib/demoData';
import MapPicker from '@/components/admin/MapPicker';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/lib/AuthContext';

const statusColors = {
  active: { bg: 'bg-[#C8E650]/10', text: 'text-[#C8E650]', border: 'border-[#C8E650]/40' },
  upcoming: { bg: 'bg-[#6B9FD4]/10', text: 'text-[#6B9FD4]', border: 'border-[#6B9FD4]/40' },
  completed: { bg: 'bg-muted', text: 'text-muted-foreground', border: 'border-border' },
  expired: { bg: 'bg-[#E8956A]/10', text: 'text-[#E8956A]', border: 'border-[#E8956A]/40' },
  draft: { bg: 'bg-muted/50', text: 'text-muted-foreground', border: 'border-border/50' },
};

const categoryEmoji = {
  health: '💪',
  mind: '🧠',
  social: '🤝',
  event: '🎯',
  challenge: '⚔️',
  side: '🌟',
  solo: '👤',
  squad: '👥',
};

export default function AdminEvents() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('active');
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rarity, setRarity] = useState('common');
  const [proofType, setProofType] = useState('photo');
  const [radius, setRadius] = useState(150);
  const [isCustomRadius, setIsCustomRadius] = useState(false);
  const [xpReward, setXpReward] = useState('50');
  const [coinsReward, setCoinsReward] = useState('100');
  const [isActive, setIsActive] = useState(true);
  const [category, setCategory] = useState('event');
  const isGlobal = category === 'global';
  const [durationHours, setDurationHours] = useState(24);
  const [isCustomDuration, setIsCustomDuration] = useState(false);
  const [location, setLocation] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [events, setEvents] = useState([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  // Reward Config State
  const [enableReward, setEnableReward] = useState(false);
  const [rewardTitle, setRewardTitle] = useState('');
  const [rewardDescription, setRewardDescription] = useState('');
  const [rewardCodeType, setRewardCodeType] = useState('generated');
  const [sharedCode, setSharedCode] = useState('');
  const [uniqueCodes, setUniqueCodes] = useState('');
  const [maxTotal, setMaxTotal] = useState(1);
  const [maxPerUser, setMaxPerUser] = useState(1);
  const [isUnlimitedTotal, setIsUnlimitedTotal] = useState(true);
  const [isUnlimitedPerUser, setIsUnlimitedPerUser] = useState(false);

  const fetchEvents = async () => {
    try {
      setIsLoadingEvents(true);
      const { data, error } = await supabase
        .from('missions')
        .select(`
          id,
          title,
          description,
          category,
          is_active,
          xp_reward,
          starts_at,
          expires_at
        `)
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const now = new Date();
      const transformed = (data || []).map(m => {
        const start = new Date(m.starts_at);
        const end = m.expires_at ? new Date(m.expires_at) : null;

        let status = 'draft';
        if (!m.is_active) {
          status = 'draft';
        } else if (end && end < now) {
          status = 'expired';
        } else if (start > now) {
          status = 'upcoming';
        } else {
          status = 'active';
        }

        return {
          id: m.id,
          name: m.title,
          description: m.description || 'No description provided.',
          category: m.category || 'event',
          status,
          date: start.toLocaleDateString(),
          location: 'Map Location',
          participants: 0,
          maxParticipants: 100,
          xpReward: m.xp_reward || 0
        };
      });

      setEvents(transformed);
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setIsLoadingEvents(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user]);

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

      const starts_at = new Date().toISOString();
      const expires_at = new Date(Date.now() + durationHours * 60 * 60 * 1000).toISOString();

      const missionData = {
        title,
        description,
        type: 'event',
        category: isGlobal ? 'global' : category,
        rarity,
        lat: isGlobal ? 0 : location.lat,
        lng: isGlobal ? 0 : location.lng,
        radius_m: isGlobal ? 0 : parseInt(radius),
        created_by: user.id,
        xp_reward: parseInt(xpReward),
        coins_reward: parseInt(coinsReward),
        is_active: isActive,
        is_global: isGlobal,
        proof_upload_type: proofType,
        cover_url,
        starts_at,
        expires_at,
      };

      const { error: insertError, data: newMissions } = await supabase
        .from('missions')
        .insert(missionData)
        .select('id');

      if (insertError) throw insertError;

      const missionId = newMissions[0].id;

      if (enableReward) {
        // Fetch business
        const { data: biz, error: bizError } = await supabase
          .from('businesses')
          .select('id, name')
          .eq('owner_id', user.id)
          .single();

        if (!bizError && biz) {
          const rewardData = {
            source: 'event',
            mission_id: missionId,
            business_id: biz.id,
            partner_name: biz.name,
            title: rewardTitle || title + ' Reward',
            description: rewardDescription,
            code_type: rewardCodeType,
            shared_code: rewardCodeType === 'shared' ? sharedCode : null,
            max_redemptions_total: isUnlimitedTotal ? null : parseInt(maxTotal),
            max_redemptions_per_user: isUnlimitedPerUser ? null : parseInt(maxPerUser),
            cost_coins: 0,
            cost_xp: 0,
            stock: 9999999, // practically unlimited claims, usage limited by max_redemptions
            is_active: true
          };

          const { data: newRewards, error: rewardError } = await supabase
            .from('rewards')
            .insert(rewardData)
            .select('id');

          if (!rewardError && newRewards?.length > 0 && rewardCodeType === 'unique') {
            const rewardId = newRewards[0].id;
            const codes = uniqueCodes.split(/[\n,]+/).map(c => c.trim()).filter(c => c.length > 0);
            if (codes.length > 0) {
              const uniqueCodesData = codes.map(c => ({
                reward_id: rewardId,
                business_id: biz.id,
                code: c
              }));
              await supabase.from('reward_unique_codes').insert(uniqueCodesData);

              // update stock to match the number of unique codes
              await supabase.from('rewards').update({ stock: codes.length }).eq('id', rewardId);
            }
          }
        }
      }

      setShowCreateModal(false);
      // Reset form
      setTitle('');
      setDescription('');
      setCoverImage(null);
      setLocation(null);
      setIsActive(true);
      setCategory('event');
      setDurationHours(24);
      setEnableReward(false);
      setRewardTitle('');
      setRewardDescription('');
      setRewardCodeType('generated');
      setSharedCode('');
      setUniqueCodes('');
      setMaxTotal(1);
      setMaxPerUser(1);
      setIsUnlimitedTotal(true);
      setIsUnlimitedPerUser(false);
      fetchEvents();

    } catch (err) {
      console.error('Error creating event:', err);
      setFormError(err.message || 'Failed to create event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = events.filter((e) => {
    const matchesFilter = e.status === filter;
    const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const statusCounts = {
    active: events.filter((e) => e.status === 'active').length,
    upcoming: events.filter((e) => e.status === 'upcoming').length,
    completed: events.filter((e) => e.status === 'completed').length,
    expired: events.filter((e) => e.status === 'expired').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-pixel text-[clamp(0.7rem,2vw,1rem)] text-foreground glow-red mb-2 leading-relaxed">
            {t("admin.events.title")}
          </h1>
          <p className="font-body text-sm text-muted-foreground">
            {t("admin.events.subtitle")}
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-[#E85D4A] text-white px-4 py-2.5 font-pixel text-[8px] tracking-wider hover:bg-[#d44d3a] transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t("admin.events.createEventBtn")}
        </button>
      </div>

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t("admin.events.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card border border-border pl-10 pr-4 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-[#E85D4A] focus:outline-none transition-colors"
          />
        </div>
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-1 bg-card border border-border p-1">
          {['active', 'upcoming', 'completed', 'expired'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 font-pixel text-[7px] tracking-wider transition-all ${filter === s
                  ? 'bg-[#E85D4A]/20 text-[#E85D4A]'
                  : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              {t(`admin.events.filter.${s}`)} ({statusCounts[s]})
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((event, i) => {
          const sc = statusColors[event.status];
          const progress = Math.round((event.participants / event.maxParticipants) * 100);
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card border border-border p-5 hover:border-[#E85D4A]/40 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{categoryEmoji[event.category]}</span>
                  <h3 className="font-pixel text-[8px] text-foreground tracking-wide leading-relaxed">
                    {event.name}
                  </h3>
                </div>
                <span className={`px-2 py-0.5 font-pixel text-[6px] tracking-wider border ${sc.bg} ${sc.text} ${sc.border}`}>
                  {t(`admin.events.filter.${event.status}`)}
                </span>
              </div>

              <p className="font-body text-xs text-muted-foreground mb-4 line-clamp-2">
                {event.description}
              </p>

              <div className="flex items-center gap-4 text-muted-foreground mb-3">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3" />
                  <span className="font-body text-[11px]">{event.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" />
                  <span className="font-body text-[11px]">{event.date}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Users className="w-3 h-3 text-muted-foreground" />
                  <span className="font-pixel text-[7px] text-muted-foreground">
                    {event.participants}/{event.maxParticipants}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-[#C8E650]" />
                  <span className="font-pixel text-[7px] text-[#C8E650]">
                    +{event.xpReward} XP
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 bg-secondary overflow-hidden">
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: progress >= 90 ? '#E85D4A' : '#C8E650',
                  }}
                />
              </div>
              <p className="font-pixel text-[6px] text-muted-foreground mt-1 text-right">{progress}% {t("admin.events.fullText")}</p>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="font-pixel text-[9px] text-muted-foreground tracking-wider">{t("admin.events.noEventsFound")}</p>
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
              className="relative w-full max-w-xl bg-card border border-[#6B9FD4]/30 shadow-[0_0_30px_rgba(107,159,212,0.1)] p-6 z-10 overflow-y-auto max-h-[90vh] custom-scrollbar"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                <div>
                  <h2 className="font-pixel text-[12px] text-foreground tracking-widest glow-purple">{t("admin.events.createModal.title")}</h2>
                  <p className="font-body text-xs text-muted-foreground mt-1">{t("admin.events.createModal.subtitle")}</p>
                </div>
                <button onClick={() => setShowCreateModal(false)} className="text-muted-foreground hover:text-foreground bg-secondary/50 p-2">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form className="space-y-8" onSubmit={handleCreateEvent}>
                {formError && (
                  <div className="bg-red-500/10 border border-red-500/50 p-4">
                    <p className="font-pixel text-[8px] text-red-500 tracking-wider">{t("admin.events.createModal.errorPrefix")}{formError}</p>
                  </div>
                )}

                {/* Info Box */}
                <div className="bg-[#6B9FD4]/10 border border-[#6B9FD4]/30 p-4 flex items-start gap-3">
                  <div className="mt-0.5">ℹ️</div>
                  <p className="font-body text-xs text-[#6B9FD4] leading-relaxed">
                    {t("admin.events.createModal.infoMessage")}
                  </p>
                </div>

                {/* CATEGORY */}
                <div>
                  <label className="font-pixel text-[8px] text-[#A663E0] tracking-widest mb-3 block">КАТЕГОРИЯ</label>
                  <p className="font-body text-[10px] text-muted-foreground mb-3">Изберете вида на събитието/мисията.</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'global', label: 'Global Quest' },
                      { id: 'side', label: 'Side Quest' },
                      { id: 'event', label: 'Event' }
                    ].map(c => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setCategory(c.id)}
                        className={`py-2 px-1 font-pixel text-[6px] tracking-wider border transition-all ${category === c.id
                            ? 'bg-[#A663E0]/20 border-[#A663E0] text-[#A663E0] shadow-[0_0_10px_rgba(166,99,224,0.3)]'
                            : 'bg-secondary border-border text-muted-foreground hover:bg-secondary/80'
                          }`}
                      >
                        {c.label.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* RARITY */}
                <div>
                  <label className="font-pixel text-[8px] text-[#E8C36A] tracking-widest mb-3 block">{t("admin.events.createModal.rarityLabel")}</label>
                  <p className="font-body text-[10px] text-muted-foreground mb-3">{t("admin.events.createModal.rarityDesc")}</p>
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
                  <label className="font-pixel text-[8px] text-[#6B9FD4] tracking-widest mb-3 block">{t("admin.events.createModal.briefingLabel")}</label>
                  <div className="space-y-4">
                    <div>
                      <span className="font-pixel text-[6px] text-muted-foreground tracking-widest block mb-1.5">{t("admin.events.createModal.briefingTitle")}</span>
                      <input
                        value={title} onChange={(e) => setTitle(e.target.value)} required
                        className="w-full bg-background border border-border px-4 py-2.5 font-body text-sm focus:border-[#6B9FD4] focus:outline-none"
                        placeholder={t("admin.events.createModal.briefingTitlePlaceholder")}
                      />
                    </div>
                    <div>
                      <span className="font-pixel text-[6px] text-muted-foreground tracking-widest block mb-1.5">{t("admin.events.createModal.briefingDesc")}</span>
                      <textarea
                        value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
                        className="w-full bg-background border border-border px-4 py-2.5 font-body text-sm focus:border-[#6B9FD4] focus:outline-none resize-none"
                        placeholder={t("admin.events.createModal.briefingDescPlaceholder")}
                      />
                    </div>
                    <div>
                      <span className="font-pixel text-[6px] text-muted-foreground tracking-widest block mb-1.5">{t("admin.events.createModal.coverImage")}</span>
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
                              {t("admin.events.createModal.removeImage")}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label className="w-full h-24 bg-background border border-border border-dashed flex flex-col items-center justify-center text-muted-foreground hover:bg-secondary/50 cursor-pointer transition-colors">
                          <span className="text-xl mb-1">📸</span>
                          <span className="font-pixel text-[6px] tracking-wider">{t("admin.events.createModal.pickImage")}</span>
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
                  <label className="font-pixel text-[8px] text-[#5DE8A4] tracking-widest mb-3 block">{t("admin.events.createModal.proofLabel")}</label>
                  <p className="font-body text-[10px] text-muted-foreground mb-3">{t("admin.events.createModal.proofDesc")}</p>
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
                    <label className="font-pixel text-[8px] text-[#D47BA8] tracking-widest mb-3 block">{t("admin.events.createModal.locationLabel")}</label>
                    <MapPicker onLocationSelect={(pos) => setLocation(pos)} />
                  </div>
                )}

                {/* RADIUS */}
                {!isGlobal && (
                  <div>
                    <label className="font-pixel text-[8px] text-[#D47BA8] tracking-widest mb-3 block">{t("admin.events.createModal.radiusLabel")}</label>
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
                        {t("admin.events.createModal.customBtn")}
                      </button>
                    </div>
                    {isCustomRadius && (
                      <div className="mt-3">
                        <input
                          type="number" value={radius} onChange={(e) => setRadius(Number(e.target.value))}
                          className="w-full max-w-[200px] bg-background border border-border px-4 py-2 font-body text-sm focus:border-[#D47BA8] focus:outline-none"
                          placeholder={t("admin.events.createModal.radiusPlaceholder")}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* DURATION */}
                <div>
                  <label className="font-pixel text-[8px] text-[#E86A6A] tracking-widest mb-3 block">{t("admin.events.createModal.durationLabel")}</label>
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
                        placeholder={t("admin.events.createModal.durationPlaceholder")}
                      />
                    </div>
                  )}
                </div>

                {/* REWARDS & STATUS */}
                <div>
                  <label className="font-pixel text-[8px] text-[#E8C36A] tracking-widest mb-3 block">{t("admin.events.createModal.rewardsLabel")}</label>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <span className="font-pixel text-[6px] text-muted-foreground tracking-widest block mb-1.5">{t("admin.events.createModal.xpLabel")}</span>
                      <input
                        type="number" value={xpReward} onChange={(e) => setXpReward(e.target.value)}
                        className="w-full bg-background border border-border px-4 py-2.5 font-body text-sm focus:border-[#E8C36A] focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="font-pixel text-[6px] text-muted-foreground tracking-widest block mb-1.5">{t("admin.events.createModal.coinsLabel")}</span>
                      <input
                        type="number" value={coinsReward} onChange={(e) => setCoinsReward(e.target.value)}
                        className="w-full bg-background border border-border px-4 py-2.5 font-body text-sm focus:border-[#E8C36A] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className={`p-4 border transition-all flex items-center justify-between mt-4 ${isActive ? 'border-[#6B9FD4]/50 bg-[#6B9FD4]/5' : 'border-border bg-secondary/30'}`}>
                    <div>
                      <p className="font-pixel text-[8px] text-foreground tracking-wider">{t("admin.events.createModal.activeTitle")}</p>
                      <p className="font-body text-[10px] text-muted-foreground mt-1">{t("admin.events.createModal.activeDesc")}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                      <div className="w-9 h-5 bg-secondary peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#6B9FD4] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#6B9FD4]"></div>
                    </label>
                  </div>
                </div>

                {/* CUSTOM REWARD */}
                <div>
                  <label className="font-pixel text-[8px] text-[#A78BFA] tracking-widest mb-3 block">{t("admin.events.createModal.couponLabel")}</label>
                  <div className={`p-4 border transition-all flex items-center justify-between mb-4 ${enableReward ? 'border-[#A78BFA]/50 bg-[#A78BFA]/5' : 'border-border bg-secondary/30'}`}>
                    <div>
                      <p className="font-pixel text-[8px] text-foreground tracking-wider">{t("admin.events.createModal.attachRewardTitle")}</p>
                      <p className="font-body text-[10px] text-muted-foreground mt-1">{t("admin.events.createModal.attachRewardDesc")}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={enableReward} onChange={(e) => setEnableReward(e.target.checked)} />
                      <div className="w-9 h-5 bg-secondary peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#A78BFA] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#A78BFA]"></div>
                    </label>
                  </div>

                  {enableReward && (
                    <div className="space-y-4 p-4 border border-[#A78BFA]/30 bg-background">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="font-pixel text-[6px] text-muted-foreground tracking-widest block mb-1.5">{t("admin.events.createModal.rewardTitleLabel")}</span>
                          <input
                            value={rewardTitle} onChange={(e) => setRewardTitle(e.target.value)}
                            className="w-full bg-background border border-border px-4 py-2 font-body text-sm focus:border-[#A78BFA] focus:outline-none"
                            placeholder={t("admin.events.createModal.rewardTitlePlaceholder")}
                          />
                        </div>
                        <div>
                          <span className="font-pixel text-[6px] text-muted-foreground tracking-widest block mb-1.5">{t("admin.events.createModal.rewardDescLabel")}</span>
                          <input
                            value={rewardDescription} onChange={(e) => setRewardDescription(e.target.value)}
                            className="w-full bg-background border border-border px-4 py-2 font-body text-sm focus:border-[#A78BFA] focus:outline-none"
                            placeholder={t("admin.events.createModal.rewardDescPlaceholder")}
                          />
                        </div>
                      </div>

                      <div>
                        <span className="font-pixel text-[6px] text-muted-foreground tracking-widest block mb-1.5">{t("admin.events.createModal.codeTypeLabel")}</span>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { id: 'generated', label: t("admin.events.createModal.codeTypes.generated.title"), desc: t("admin.events.createModal.codeTypes.generated.desc") },
                            { id: 'shared', label: t("admin.events.createModal.codeTypes.shared.title"), desc: t("admin.events.createModal.codeTypes.shared.desc") },
                            { id: 'unique', label: t("admin.events.createModal.codeTypes.unique.title"), desc: t("admin.events.createModal.codeTypes.unique.desc") }
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
                          <span className="font-pixel text-[6px] text-muted-foreground tracking-widest block mb-1.5">{t("admin.events.createModal.promoCodeLabel")}</span>
                          <input
                            value={sharedCode} onChange={(e) => setSharedCode(e.target.value)} required
                            className="w-full bg-background border border-border px-4 py-2 font-body text-sm focus:border-[#A78BFA] focus:outline-none uppercase"
                            placeholder={t("admin.events.createModal.promoCodePlaceholder")}
                          />
                        </div>
                      )}

                      {rewardCodeType === 'unique' && (
                        <div>
                          <span className="font-pixel text-[6px] text-muted-foreground tracking-widest block mb-1.5">{t("admin.events.createModal.uniqueCodesLabel")}</span>
                          <textarea
                            value={uniqueCodes} onChange={(e) => setUniqueCodes(e.target.value)} required rows={4}
                            className="w-full bg-background border border-border px-4 py-2 font-body text-sm focus:border-[#A78BFA] focus:outline-none resize-none"
                            placeholder={t("admin.events.createModal.uniqueCodesPlaceholder")}
                          />
                        </div>
                      )}

                      <div className="pt-2 border-t border-border mt-4">
                        <span className="font-pixel text-[6px] text-muted-foreground tracking-widest block mb-3">{t("admin.events.createModal.limitsLabel")}</span>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-pixel text-[6px] text-muted-foreground tracking-widest block">{t("admin.events.createModal.maxTotal")}</span>
                              <label className="flex items-center gap-1 cursor-pointer">
                                <input type="checkbox" checked={isUnlimitedTotal} onChange={(e) => setIsUnlimitedTotal(e.target.checked)} className="rounded bg-background border-border" />
                                <span className="font-pixel text-[6px] text-muted-foreground">{t("admin.events.createModal.unlimited")}</span>
                              </label>
                            </div>
                            <input
                              type="number" value={maxTotal} onChange={(e) => setMaxTotal(e.target.value)} disabled={isUnlimitedTotal} min="1"
                              className="w-full bg-background border border-border px-4 py-2 font-body text-sm focus:border-[#A78BFA] focus:outline-none disabled:opacity-50"
                            />
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-pixel text-[6px] text-muted-foreground tracking-widest block">{t("admin.events.createModal.maxPerUser")}</span>
                              <label className="flex items-center gap-1 cursor-pointer">
                                <input type="checkbox" checked={isUnlimitedPerUser} onChange={(e) => setIsUnlimitedPerUser(e.target.checked)} className="rounded bg-background border-border" />
                                <span className="font-pixel text-[6px] text-muted-foreground">{t("admin.events.createModal.unlimited")}</span>
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

                {/* CTA */}
                <div className="flex gap-4 pt-4 border-t border-border">
                  <button type="button" onClick={() => setShowCreateModal(false)} disabled={isSubmitting} className="flex-1 bg-secondary text-foreground px-4 py-3 font-pixel text-[8px] tracking-wider hover:bg-secondary/80 transition-colors disabled:opacity-50">
                    {t("admin.events.createModal.cancelBtn")}
                  </button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 bg-[#C8E650] text-black px-4 py-3 font-pixel text-[8px] tracking-wider hover:bg-[#b5d148] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></span>
                        {t("admin.events.createModal.deployingBtn")}
                      </>
                    ) : (
                      t("admin.events.createModal.deployBtn")
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
