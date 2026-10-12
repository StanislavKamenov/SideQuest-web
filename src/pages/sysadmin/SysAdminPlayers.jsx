import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { 
  Users, Search, Loader2, ShieldAlert, ShieldCheck, 
  Ban, History, X, Crown, Sparkles, Star, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { useTranslation } from 'react-i18next';

export default function SysAdminPlayers() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all'); // all | premium | early | admin | banned
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Modals
  const [trustModalUser, setTrustModalUser] = useState(null);
  const [banModal, setBanModal] = useState(null);

  const { data: players, isLoading } = useQuery({
    queryKey: ['sysadmin-players', search],
    queryFn: async () => {
      let q = supabase
        .from('profiles')
        .select('*')
        .order('xp', { ascending: false })
        .limit(100);
        
      if (search) {
        q = q.ilike('username', `%${search}%`);
      }
      
      const { data, error } = await q;
      if (error) throw error;
      return data;
    }
  });

  const { data: trustHistory, isLoading: loadingHistory } = useQuery({
    queryKey: ['sysadmin-trust-history', trustModalUser],
    queryFn: async () => {
      if (!trustModalUser) return [];
      const { data, error } = await supabase
        .from('trust_score_history')
        .select('*')
        .eq('user_id', trustModalUser)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!trustModalUser
  });

  const callAdminManageUser = async ({ userId, action, value }) => {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;
    if (!token) throw new Error("No active session");

    const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-manage-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ user_id: userId, action, value })
    });

    const result = await res.json();
    if (!res.ok || !result.ok) {
      throw new Error(result.error || "Failed to update user");
    }
    return result.user;
  };

  const toggleAdmin = useMutation({
    mutationFn: async ({ id, is_admin }) => {
      return await callAdminManageUser({
        userId: id,
        action: 'set_admin',
        value: is_admin
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['sysadmin-players']);
      toast({ 
        title: data?.is_admin ? (t("sysadmin.players.toast.adminGranted") || "Администраторски права бяха предоставени") : (t("sysadmin.players.toast.adminRevoked") || "Администраторски права бяха отнети"), 
        className: 'bg-[#C8E650] text-black font-pixel' 
      });
    },
    onError: (err) => {
      toast({ title: t("sysadmin.players.toast.updateFailed") || "Грешка при обновяване", description: err.message, variant: 'destructive' });
    }
  });

  const togglePremium = useMutation({
    mutationFn: async ({ id, currentStatus }) => {
      const isGranting = currentStatus !== 'active' && currentStatus !== 'premium';
      return await callAdminManageUser({
        userId: id,
        action: 'set_premium',
        value: isGranting ? 'active' : 'none'
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['sysadmin-players']);
      toast({
        title: (data?.premium_status === 'active' || data?.premium_status === 'premium')
          ? (t("sysadmin.players.toast.premiumGranted") || "Премиум статусът е активиран") 
          : (t("sysadmin.players.toast.premiumRevoked") || "Премиум статусът е премахнат"),
        className: 'bg-[#A663E0] text-white font-pixel'
      });
    },
    onError: (err) => {
      toast({ title: t("sysadmin.players.toast.updateFailed") || "Грешка при обновяване", description: err.message, variant: 'destructive' });
    }
  });

  const toggleEarlySupporter = useMutation({
    mutationFn: async ({ id, is_early }) => {
      return await callAdminManageUser({
        userId: id,
        action: 'set_early_supporter',
        value: !is_early
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['sysadmin-players']);
      toast({
        title: data?.is_early_supporter 
          ? (t("sysadmin.players.toast.earlyGranted") || "Early Supporter статусът е активиран") 
          : (t("sysadmin.players.toast.earlyRevoked") || "Early Supporter статусът е премахнат"),
        className: 'bg-[#E8C36A] text-black font-pixel'
      });
    },
    onError: (err) => {
      toast({ title: t("sysadmin.players.toast.updateFailed") || "Грешка при обновяване", description: err.message, variant: 'destructive' });
    }
  });

  const handleBanToggle = async (id, is_banned, reason) => {
    try {
      const { error } = await supabase.rpc('sysadmin_set_user_ban', {
        p_user_id: id,
        p_is_banned: is_banned,
        p_reason: reason
      });
      if (error) throw error;
      queryClient.invalidateQueries(['sysadmin-players']);
      toast({ title: is_banned ? (t("sysadmin.players.toast.userBanned") || "User banned") : (t("sysadmin.players.toast.userUnbanned") || "User unbanned") });
    } catch (e) {
      toast({ title: t("sysadmin.players.toast.banFailed") || "Ban action failed", description: e.message, variant: 'destructive' });
    } finally {
      setBanModal(null);
    }
  };

  const filteredPlayers = (players || []).filter(player => {
    if (roleFilter === 'premium') {
      return player.premium_status === 'active' || player.premium_status === 'premium';
    }
    if (roleFilter === 'early') {
      return !!player.is_early_supporter;
    }
    if (roleFilter === 'admin') {
      return player.is_admin || player.role === 'admin';
    }
    if (roleFilter === 'banned') {
      return !!player.is_banned;
    }
    return true;
  });

  const premiumCount = (players || []).filter(p => p.premium_status === 'active' || p.premium_status === 'premium').length;
  const earlyCount = (players || []).filter(p => !!p.is_early_supporter).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-[#A663E0]" />
          <div>
            <h1 className="font-pixel text-xl text-foreground tracking-tight" style={{ textShadow: '0 0 10px rgba(166, 99, 224, 0.5)' }}>
              {t("sysadmin.players.title") || "PLAYER MANAGEMENT"}
            </h1>
            <p className="font-body text-sm text-muted-foreground mt-1">
              {t("sysadmin.players.subtitle") || "Manage players, track trust scores, and monitor Premium & Early Supporters."}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3">
          <div className="bg-card border border-[#E8C36A]/40 p-3.5 flex flex-col items-center justify-center min-w-[90px]">
            <span className="font-pixel text-xl text-[#E8C36A]" style={{ textShadow: '0 0 8px #E8C36A66' }}>
              {earlyCount}
            </span>
            <span className="font-pixel text-[6px] text-[#E8C36A]/80 tracking-widest mt-1 flex items-center gap-1">
              <Sparkles size={8} /> EARLY
            </span>
          </div>

          <div className="bg-card border border-[#A663E0]/40 p-3.5 flex flex-col items-center justify-center min-w-[90px]">
            <span className="font-pixel text-xl text-[#A663E0]" style={{ textShadow: '0 0 8px #A663E066' }}>
              {premiumCount}
            </span>
            <span className="font-pixel text-[6px] text-[#A663E0]/80 tracking-widest mt-1 flex items-center gap-1">
              <Crown size={8} /> PREMIUM
            </span>
          </div>

          <div className="bg-card border border-border p-3.5 flex flex-col items-center justify-center min-w-[90px]">
            <span className="font-pixel text-xl text-foreground">
              {players?.length || 0}
            </span>
            <span className="font-pixel text-[6px] text-muted-foreground tracking-widest mt-1">
              TOTAL
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-border pb-3">
        {/* Quick Role Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { id: 'all', label: t("sysadmin.players.filter.all") || 'ALL', count: players?.length || 0 },
            { id: 'premium', label: t("sysadmin.players.filter.premium") || 'PREMIUM', count: premiumCount, color: '#A663E0' },
            { id: 'early', label: t("sysadmin.players.filter.early") || 'EARLY SUPPORTERS', count: earlyCount, color: '#E8C36A' },
            { id: 'admin', label: t("sysadmin.players.filter.admins") || 'ADMINS', count: (players || []).filter(p => p.is_admin || p.role === 'admin').length, color: '#C8E650' },
            { id: 'banned', label: t("sysadmin.players.filter.banned") || 'BANNED', count: (players || []).filter(p => p.is_banned).length, color: '#E85D4A' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setRoleFilter(f.id)}
              className={`px-3 py-1.5 font-pixel text-[8px] tracking-wider border transition-all flex items-center gap-1.5 ${
                roleFilter === f.id
                  ? 'bg-secondary border-border shadow-[0_0_10px_rgba(166,99,224,0.2)]'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
              style={roleFilter === f.id && f.color ? { borderColor: f.color, color: f.color } : {}}
            >
              <span>{f.label}</span>
              <span className="opacity-70 text-[7px]">({f.count})</span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t("sysadmin.players.search") || "Search username..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card border-2 border-border pl-10 pr-4 py-2 font-pixel text-[9px] text-foreground placeholder:text-muted-foreground/40 focus:border-[#A663E0] focus:outline-none transition-colors tracking-wider"
            style={{ boxShadow: 'inset 0 0 8px rgba(0,0,0,0.3)' }}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-[#A663E0]/30 border-t-[#A663E0] rounded-full animate-spin" />
        </div>
      ) : filteredPlayers.length === 0 ? (
        <div className="bg-card border border-border p-12 text-center">
          <Users className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
          <p className="font-pixel text-[10px] text-muted-foreground tracking-wider">{t("sysadmin.players.noPlayers")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPlayers.map((player, i) => {
            const isEarly = !!player.is_early_supporter;
            const isPrem = player.premium_status === 'active' || player.premium_status === 'premium';
            const isAdmin = player.is_admin || player.role === 'admin';

            // Avatar border styling
            let avatarBorderStyle = 'border-border bg-secondary/30';
            if (isEarly && isPrem) {
              avatarBorderStyle = 'border-[#E8C36A] bg-[#E8C36A]/10 shadow-[0_0_12px_rgba(232,195,106,0.35)]';
            } else if (isEarly) {
              avatarBorderStyle = 'border-[#E8C36A] bg-[#E8C36A]/10 shadow-[0_0_10px_rgba(232,195,106,0.25)]';
            } else if (isPrem) {
              avatarBorderStyle = 'border-[#A663E0] bg-[#A663E0]/10 shadow-[0_0_10px_rgba(166,99,224,0.25)]';
            } else if (isAdmin) {
              avatarBorderStyle = 'border-[#C8E650]/50 bg-[#C8E650]/10';
            }

            return (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
                className={`bg-card border-2 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                  player.is_banned 
                    ? 'border-[#E85D4A]/50' 
                    : isEarly
                      ? 'border-[#E8C36A]/40 hover:border-[#E8C36A]'
                      : isPrem
                        ? 'border-[#A663E0]/40 hover:border-[#A663E0]'
                        : 'border-border hover:border-[#A663E0]/30'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className={`w-12 h-12 flex items-center justify-center border-2 overflow-hidden shrink-0 relative ${avatarBorderStyle}`}>
                    {player.avatar_url ? (
                      <img src={player.avatar_url} alt={player.username} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-pixel text-[12px] text-muted-foreground">
                        {(player.username || '?')[0]?.toUpperCase()}
                      </span>
                    )}

                    {/* Small badge icon in corner of avatar */}
                    {isEarly && (
                      <div className="absolute bottom-0 right-0 bg-[#E8C36A] text-black p-0.5" title="Early Supporter">
                        <Sparkles size={8} />
                      </div>
                    )}
                  </div>

                  {/* Player Info & Badges */}
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-pixel text-[11px] text-foreground tracking-wide">
                        {player.username || t("sysadmin.players.unknown")}
                      </h3>

                      {/* Early Supporter Badge */}
                      {isEarly && (
                        <span 
                          className="font-pixel text-[6px] text-[#E8C36A] border border-[#E8C36A]/50 bg-[#E8C36A]/15 px-1.5 py-0.5 flex items-center gap-1 tracking-widest shadow-[0_0_8px_rgba(232,195,106,0.2)]"
                          style={{ textShadow: '0 0 6px #E8C36A88' }}
                        >
                          <Sparkles size={8} className="text-[#E8C36A]" />
                          {t("sysadmin.players.earlySupporter") || "EARLY SUPPORTER"}
                        </span>
                      )}

                      {/* Premium Badge */}
                      {isPrem && (
                        <span 
                          className="font-pixel text-[6px] text-[#A663E0] border border-[#A663E0]/50 bg-[#A663E0]/15 px-1.5 py-0.5 flex items-center gap-1 tracking-widest shadow-[0_0_8px_rgba(166,99,224,0.2)]"
                          style={{ textShadow: '0 0 6px #A663E088' }}
                        >
                          <Crown size={8} className="text-[#A663E0]" />
                          {t("sysadmin.players.premium") || "PREMIUM"}
                        </span>
                      )}

                      {/* Admin Badge */}
                      {isAdmin && (
                        <span className="font-pixel text-[6px] text-[#C8E650] border border-[#C8E650]/40 px-1.5 py-0.5 tracking-widest"
                          style={{ textShadow: '0 0 6px #C8E65066' }}
                        >
                          {t("sysadmin.players.admin")}
                        </span>
                      )}

                      {/* Banned Badge */}
                      {player.is_banned && (
                        <span className="font-pixel text-[6px] text-[#E85D4A] border border-[#E85D4A]/40 px-1.5 py-0.5 flex items-center gap-1 tracking-widest"
                          style={{ textShadow: '0 0 6px #E85D4A66' }}
                        >
                          <Ban size={10} /> {t("sysadmin.players.banned")}
                        </span>
                      )}
                    </div>

                    <p className="font-pixel text-[7px] text-muted-foreground flex items-center gap-3 tracking-wider flex-wrap">
                      <span>{player.xp || 0} {t("sysadmin.players.xp")}</span>
                      <span className="text-border">•</span>
                      <span className="flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors" onClick={() => setTrustModalUser(player.id)}>
                        {t("sysadmin.players.trustScore")} <strong className={player.trust_score < 50 ? 'text-[#E85D4A]' : 'text-[#C8E650]'} style={{ textShadow: player.trust_score < 50 ? '0 0 6px #E85D4A66' : '0 0 6px #C8E65066' }}>{player.trust_score ?? 50}</strong>
                        <History size={12} className="ml-1 opacity-70" />
                      </span>
                      {player.city && (
                        <>
                          <span className="text-border">•</span>
                          <span>{player.city}</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Toggle Early Supporter Button */}
                  <button
                    onClick={() => toggleEarlySupporter.mutate({ id: player.id, is_early: isEarly })}
                    disabled={toggleEarlySupporter.isPending}
                    className={`flex items-center gap-1 px-2.5 py-1.5 font-pixel text-[7px] tracking-wider border transition-all ${
                      isEarly
                        ? 'bg-[#E8C36A]/20 border-[#E8C36A] text-[#E8C36A] hover:bg-[#E8C36A]/30'
                        : 'bg-secondary/40 border-border text-muted-foreground hover:text-[#E8C36A] hover:border-[#E8C36A]/50'
                    }`}
                    title={isEarly ? "Премахни Early Supporter" : "Дай Early Supporter"}
                  >
                    <Sparkles size={11} className={isEarly ? "text-[#E8C36A]" : "opacity-60"} />
                    {isEarly ? "EARLY SUPPORTER ✓" : "+ EARLY"}
                  </button>

                  {/* Toggle Premium Button */}
                  <button
                    onClick={() => togglePremium.mutate({ id: player.id, currentStatus: player.premium_status })}
                    disabled={togglePremium.isPending}
                    className={`flex items-center gap-1 px-2.5 py-1.5 font-pixel text-[7px] tracking-wider border transition-all ${
                      isPrem
                        ? 'bg-[#A663E0]/20 border-[#A663E0] text-[#A663E0] hover:bg-[#A663E0]/30'
                        : 'bg-secondary/40 border-border text-muted-foreground hover:text-[#A663E0] hover:border-[#A663E0]/50'
                    }`}
                    title={isPrem ? "Премахни Premium" : "Дай Premium"}
                  >
                    <Crown size={11} className={isPrem ? "text-[#A663E0]" : "opacity-60"} />
                    {isPrem ? "PREMIUM ✓" : "+ PREMIUM"}
                  </button>

                  {/* Ban Button */}
                  <button
                    onClick={() => setBanModal({ id: player.id, is_banned: player.is_banned, username: player.username })}
                    className={`flex items-center gap-1.5 px-3 py-1.5 font-pixel text-[7px] tracking-wider transition-all ${
                      player.is_banned
                        ? 'bg-secondary/50 border border-border text-muted-foreground hover:text-foreground hover:border-[#C8E650]/50'
                        : 'bg-[#E85D4A]/10 border border-[#E85D4A]/40 text-[#E85D4A] hover:bg-[#E85D4A]/20'
                    }`}
                  >
                    <Ban size={12} />
                    {player.is_banned ? t("sysadmin.players.unban") : t("sysadmin.players.ban")}
                  </button>

                  {/* Admin Toggle Button */}
                  <button
                    onClick={() => toggleAdmin.mutate({ id: player.id, is_admin: !player.is_admin })}
                    disabled={toggleAdmin.isPending || player.role === 'admin'}
                    className={`flex items-center gap-1.5 px-3 py-1.5 font-pixel text-[7px] tracking-wider transition-all ${
                      player.role === 'admin'
                        ? 'opacity-30 cursor-not-allowed bg-secondary/30 border border-border text-muted-foreground'
                        : player.is_admin 
                          ? 'bg-[#E8956A]/10 border border-[#E8956A]/40 text-[#E8956A] hover:bg-[#E8956A]/20' 
                          : 'bg-[#C8E650]/10 border border-[#C8E650]/40 text-[#C8E650] hover:bg-[#C8E650]/20'
                    }`}
                  >
                    {player.is_admin ? <ShieldAlert size={12} /> : <ShieldCheck size={12} />}
                    {player.is_admin ? t("sysadmin.players.revokeAdmin") : t("sysadmin.players.makeAdmin")}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Trust Score History Modal */}
      <AnimatePresence>
        {trustModalUser && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="crt-card border-2 border-border p-6 max-w-lg w-full max-h-[80vh] flex flex-col"
              style={{ boxShadow: '0 0 40px rgba(166,99,224,0.15)' }}
            >
              <div className="absolute top-3 left-4 flex items-center gap-2 z-10">
                <span className="w-1.5 h-1.5 bg-[#E85D4A]" style={{ boxShadow: '0 0 4px #E85D4A' }} />
                <span className="w-1.5 h-1.5 bg-[#C8E650]" style={{ boxShadow: '0 0 4px #C8E650' }} />
                <span className="w-1.5 h-1.5 bg-[#6B9FD4]" style={{ boxShadow: '0 0 4px #6B9FD4' }} />
              </div>

              <div className="flex justify-between items-center mb-6 relative z-10 pt-3">
                <h3 className="font-pixel text-[11px] text-foreground tracking-wider" style={{ textShadow: '0 0 8px #A663E066' }}>
                  {t("sysadmin.players.trustHistory.title")}
                </h3>
                <button onClick={() => setTrustModalUser(null)} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X size={18} />
                </button>
              </div>
              <div className="overflow-y-auto flex-1 space-y-2 pr-2 relative z-10">
                {loadingHistory ? (
                  <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-[#A663E0]" /></div>
                ) : trustHistory?.length === 0 ? (
                  <div className="text-center p-8 font-pixel text-[8px] text-muted-foreground tracking-wider">{t("sysadmin.players.trustHistory.noHistory")}</div>
                ) : (
                  trustHistory?.map(entry => (
                    <div key={entry.id} className="bg-secondary/30 border border-border p-3 flex justify-between items-center">
                      <div>
                        <div className="font-pixel text-[8px] text-foreground tracking-wide">{entry.reason}</div>
                        <div className="font-pixel text-[6px] text-muted-foreground mt-1 tracking-wider">
                          {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
                        </div>
                      </div>
                      <div className={`font-pixel text-[11px] ${entry.change_amount > 0 ? 'text-[#C8E650]' : 'text-[#E85D4A]'}`}
                        style={{ textShadow: entry.change_amount > 0 ? '0 0 8px #C8E65066' : '0 0 8px #E85D4A66' }}
                      >
                        {entry.change_amount > 0 ? '+' : ''}{entry.change_amount}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Ban Modal */}
      <AnimatePresence>
        {banModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="crt-card border-2 border-border p-6 max-w-md w-full"
              style={{ boxShadow: '0 0 40px rgba(232,93,74,0.15)' }}
            >
              <div className="relative z-10">
                <h3 className="font-pixel text-[11px] text-foreground mb-2 tracking-wider" style={{ textShadow: '0 0 8px #E85D4A66' }}>
                  {banModal.is_banned ? t("sysadmin.players.banModal.unbanTitle", { username: banModal.username }) : t("sysadmin.players.banModal.banTitle", { username: banModal.username })}
                </h3>
                <p className="font-body text-sm text-muted-foreground mb-6">
                  {banModal.is_banned 
                    ? t("sysadmin.players.banModal.unbanDesc")
                    : t("sysadmin.players.banModal.banDesc")}
                </p>
                
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const reason = new FormData(e.target).get('reason');
                  handleBanToggle(banModal.id, !banModal.is_banned, reason || 'No reason provided');
                }}>
                  {!banModal.is_banned && (
                    <div className="mb-6">
                      <label className="font-pixel text-[7px] text-muted-foreground tracking-widest mb-2 block">{t("sysadmin.players.banModal.reasonLabel")}</label>
                      <input 
                        name="reason"
                        type="text" 
                        required
                        className="w-full bg-[#0a0912] border-2 border-border p-3 font-body text-sm text-foreground focus:border-[#E85D4A] focus:outline-none transition-colors"
                        style={{ boxShadow: 'inset 0 0 8px rgba(0,0,0,0.3)' }}
                        placeholder={t("sysadmin.players.banModal.reasonPlaceholder")}
                      />
                    </div>
                  )}
                  
                  <div className="flex gap-3 justify-end mt-2">
                    <button 
                      type="button"
                      onClick={() => setBanModal(null)}
                      className="px-4 py-2 font-pixel text-[8px] text-muted-foreground hover:text-foreground tracking-wider transition-colors"
                    >
                      {t("sysadmin.players.banModal.cancel")}
                    </button>
                    <button 
                      type="submit"
                      className={`px-4 py-2 font-pixel text-[8px] tracking-wider transition-all arcade-btn ${
                        banModal.is_banned 
                          ? 'bg-[#C8E650] text-black hover:bg-[#b8d640]' 
                          : 'bg-[#E85D4A] text-white hover:bg-[#d44d3a]'
                      }`}
                      style={{ boxShadow: banModal.is_banned ? '0 3px 0 0 #8aa530' : '0 3px 0 0 #9d3324' }}
                    >
                      {banModal.is_banned ? t("sysadmin.players.banModal.confirmUnban") : t("sysadmin.players.banModal.confirmBan")}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
