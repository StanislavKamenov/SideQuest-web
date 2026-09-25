import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Users, Search, Loader2, ShieldAlert, ShieldCheck, Ban, History, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { useTranslation } from 'react-i18next';

export default function SysAdminPlayers() {
  const { t, i18n } = useTranslation();
  const [search, setSearch] = useState('');
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
        .limit(50);
        
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

  const toggleAdmin = useMutation({
    mutationFn: async ({ id, is_admin }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update({ is_admin })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['sysadmin-players']);
      toast({ 
        title: data.is_admin ? t("sysadmin.players.toast.adminGranted") : t("sysadmin.players.toast.adminRevoked"), 
        className: 'bg-[#C8E650] text-black font-pixel' 
      });
    },
    onError: (err) => {
      toast({ title: t("sysadmin.players.toast.updateFailed"), description: err.message, variant: 'destructive' });
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
      toast({ title: is_banned ? t("sysadmin.players.toast.userBanned") : t("sysadmin.players.toast.userUnbanned") });
    } catch (e) {
      toast({ title: t("sysadmin.players.toast.banFailed"), description: e.message, variant: 'destructive' });
    } finally {
      setBanModal(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-[#A663E0]" />
          <div>
            <h1 className="font-pixel text-xl text-foreground tracking-tight" style={{ textShadow: '0 0 10px rgba(166, 99, 224, 0.5)' }}>
              {t("sysadmin.players.title")}
            </h1>
            <p className="font-body text-sm text-muted-foreground mt-1">{t("sysadmin.players.subtitle")}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder={t("sysadmin.players.search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-card border-2 border-border pl-10 pr-4 py-3 font-pixel text-[9px] text-foreground placeholder:text-muted-foreground/40 focus:border-[#A663E0] focus:outline-none transition-colors tracking-wider"
          style={{ boxShadow: 'inset 0 0 8px rgba(0,0,0,0.3)' }}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-[#A663E0]/30 border-t-[#A663E0] rounded-full animate-spin" />
        </div>
      ) : players?.length === 0 ? (
        <div className="bg-card border border-border p-12 text-center">
          <Users className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
          <p className="font-pixel text-[10px] text-muted-foreground tracking-wider">{t("sysadmin.players.noPlayers")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {players?.map((player, i) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`bg-card border-2 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                player.is_banned ? 'border-[#E85D4A]/50' : 'border-border hover:border-[#A663E0]/30'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 flex items-center justify-center border-2 overflow-hidden ${
                  player.is_admin || player.role === 'admin' ? 'border-[#C8E650]/50 bg-[#C8E650]/10' : 'border-border bg-secondary/30'
                }`}>
                  {player.avatar_url ? (
                    <img src={player.avatar_url} alt={player.username} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-pixel text-[12px] text-muted-foreground">
                      {(player.username || '?')[0]?.toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-pixel text-[11px] text-foreground tracking-wide">{player.username || t("sysadmin.players.unknown")}</h3>
                    {(player.is_admin || player.role === 'admin') && (
                      <span className="font-pixel text-[6px] text-[#C8E650] border border-[#C8E650]/40 px-1.5 py-0.5 tracking-widest"
                        style={{ textShadow: '0 0 6px #C8E65066' }}
                      >
                        {t("sysadmin.players.admin")}
                      </span>
                    )}
                    {player.is_banned && (
                      <span className="font-pixel text-[6px] text-[#E85D4A] border border-[#E85D4A]/40 px-1.5 py-0.5 flex items-center gap-1 tracking-widest"
                        style={{ textShadow: '0 0 6px #E85D4A66' }}
                      >
                        <Ban size={10} /> {t("sysadmin.players.banned")}
                      </span>
                    )}
                  </div>
                  <p className="font-pixel text-[7px] text-muted-foreground flex items-center gap-3 tracking-wider">
                    <span>{player.xp || 0} {t("sysadmin.players.xp")}</span>
                    <span className="text-border">•</span>
                    <span className="flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors" onClick={() => setTrustModalUser(player.id)}>
                      {t("sysadmin.players.trustScore")} <strong className={player.trust_score < 50 ? 'text-[#E85D4A]' : 'text-[#C8E650]'} style={{ textShadow: player.trust_score < 50 ? '0 0 6px #E85D4A66' : '0 0 6px #C8E65066' }}>{player.trust_score ?? 50}</strong>
                      <History size={12} className="ml-1 opacity-70" />
                    </span>
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setBanModal({ id: player.id, is_banned: player.is_banned, username: player.username })}
                  className={`flex items-center gap-1.5 px-3 py-2 font-pixel text-[7px] tracking-wider transition-all ${
                    player.is_banned
                      ? 'bg-secondary/50 border border-border text-muted-foreground hover:text-foreground hover:border-[#C8E650]/50'
                      : 'bg-[#E85D4A]/10 border border-[#E85D4A]/40 text-[#E85D4A] hover:bg-[#E85D4A]/20'
                  }`}
                >
                  <Ban size={14} />
                  {player.is_banned ? t("sysadmin.players.unban") : t("sysadmin.players.ban")}
                </button>
                <button
                  onClick={() => toggleAdmin.mutate({ id: player.id, is_admin: !player.is_admin })}
                  disabled={toggleAdmin.isPending || player.role === 'admin'}
                  className={`flex items-center gap-1.5 px-3 py-2 font-pixel text-[7px] tracking-wider transition-all ${
                    player.role === 'admin'
                      ? 'opacity-30 cursor-not-allowed bg-secondary/30 border border-border text-muted-foreground'
                      : player.is_admin 
                        ? 'bg-[#E8956A]/10 border border-[#E8956A]/40 text-[#E8956A] hover:bg-[#E8956A]/20' 
                        : 'bg-[#C8E650]/10 border border-[#C8E650]/40 text-[#C8E650] hover:bg-[#C8E650]/20'
                  }`}
                >
                  {player.is_admin ? <ShieldAlert size={14} /> : <ShieldCheck size={14} />}
                  {player.is_admin ? t("sysadmin.players.revokeAdmin") : t("sysadmin.players.makeAdmin")}
                </button>
              </div>
            </motion.div>
          ))}
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
              {/* Terminal header */}
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
