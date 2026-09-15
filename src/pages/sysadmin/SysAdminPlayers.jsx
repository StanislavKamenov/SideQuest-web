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
  const [trustModalUser, setTrustModalUser] = useState(null); // id
  const [banModal, setBanModal] = useState(null); // { id, is_banned, username }

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
        className: 'bg-emerald-500 text-white font-medium' 
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
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{t("sysadmin.players.title")}</h1>
          <p className="text-zinc-400">{t("sysadmin.players.subtitle")}</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          placeholder={t("sysadmin.players.search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-zinc-900 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:border-emerald-500 focus:outline-none transition-colors"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        </div>
      ) : players?.length === 0 ? (
        <div className="bg-zinc-900/50 border border-white/5 p-12 text-center text-zinc-400 rounded-xl">
          {t("sysadmin.players.noPlayers")}
        </div>
      ) : (
        <div className="space-y-4">
          {players?.map(player => (
            <div key={player.id} className={`bg-zinc-900 border rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${player.is_banned ? 'border-red-500/50' : 'border-white/10 hover:border-white/20'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center overflow-hidden border ${player.is_admin || player.role === 'admin' ? 'border-emerald-500/50' : 'border-white/10'}`}>
                  {player.avatar_url ? (
                    <img src={player.avatar_url} alt={player.username} className="w-full h-full object-cover" />
                  ) : (
                    <Users className="w-6 h-6 text-zinc-500" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg text-white">{player.username || t("sysadmin.players.unknown")}</h3>
                    {(player.is_admin || player.role === 'admin') && (
                      <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-xs font-medium border border-emerald-500/30">
                        {t("sysadmin.players.admin")}
                      </span>
                    )}
                    {player.is_banned && (
                      <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded text-xs font-medium border border-red-500/30 flex items-center gap-1">
                        <Ban size={12} /> {t("sysadmin.players.banned")}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-zinc-400 flex items-center gap-3">
                    <span>{player.xp || 0} {t("sysadmin.players.xp")}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 cursor-pointer hover:text-white" onClick={() => setTrustModalUser(player.id)}>
                      {t("sysadmin.players.trustScore")} <strong className={player.trust_score < 50 ? 'text-red-400' : 'text-emerald-400'}>{player.trust_score ?? 50}</strong>
                      <History size={14} className="ml-1 opacity-70" />
                    </span>
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setBanModal({ id: player.id, is_banned: player.is_banned, username: player.username })}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    player.is_banned
                      ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                      : 'bg-red-500/10 hover:bg-red-500/20 text-red-500'
                  }`}
                >
                  <Ban size={16} />
                  {player.is_banned ? t("sysadmin.players.unban") : t("sysadmin.players.ban")}
                </button>
                <button
                  onClick={() => toggleAdmin.mutate({ id: player.id, is_admin: !player.is_admin })}
                  disabled={toggleAdmin.isPending || player.role === 'admin'}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    player.role === 'admin'
                      ? 'opacity-50 cursor-not-allowed bg-zinc-800 text-zinc-500'
                      : player.is_admin 
                        ? 'bg-orange-500/10 hover:bg-orange-500/20 text-orange-500' 
                        : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500'
                  }`}
                >
                  {player.is_admin ? <ShieldAlert size={16} /> : <ShieldCheck size={16} />}
                  {player.is_admin ? t("sysadmin.players.revokeAdmin") : t("sysadmin.players.makeAdmin")}
                </button>
              </div>
            </div>
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
              className="bg-zinc-900 border border-white/10 rounded-xl p-6 max-w-lg w-full shadow-2xl max-h-[80vh] flex flex-col"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">{t("sysadmin.players.trustHistory.title")}</h3>
                <button onClick={() => setTrustModalUser(null)} className="text-zinc-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <div className="overflow-y-auto flex-1 space-y-3 pr-2">
                {loadingHistory ? (
                  <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-zinc-500" /></div>
                ) : trustHistory?.length === 0 ? (
                  <div className="text-center p-8 text-zinc-500">{t("sysadmin.players.trustHistory.noHistory")}</div>
                ) : (
                  trustHistory?.map(entry => (
                    <div key={entry.id} className="bg-white/5 border border-white/10 rounded-lg p-3 flex justify-between items-center">
                      <div>
                        <div className="text-sm font-medium text-white">{entry.reason}</div>
                        <div className="text-xs text-zinc-500">{formatDistanceToNow(new Date(entry.created_at), { addSuffix: true, locale: i18n.language === 'bg' ? require('date-fns/locale/bg') : undefined })}</div>
                      </div>
                      <div className={`font-bold ${entry.change_amount > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
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
              className="bg-zinc-900 border border-white/10 rounded-xl p-6 max-w-md w-full shadow-2xl"
            >
              <h3 className="text-xl font-bold text-white mb-2">
                {banModal.is_banned ? t("sysadmin.players.banModal.unbanTitle", { username: banModal.username }) : t("sysadmin.players.banModal.banTitle", { username: banModal.username })}
              </h3>
              <p className="text-zinc-400 mb-6">
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
                    <label className="block text-sm font-medium text-zinc-400 mb-2">{t("sysadmin.players.banModal.reasonLabel")}</label>
                    <input 
                      name="reason"
                      type="text" 
                      required
                      className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-red-500 focus:outline-none"
                      placeholder={t("sysadmin.players.banModal.reasonPlaceholder")}
                    />
                  </div>
                )}
                
                <div className="flex gap-3 justify-end mt-2">
                  <button 
                    type="button"
                    onClick={() => setBanModal(null)}
                    className="px-4 py-2 text-zinc-300 hover:text-white"
                  >
                    {t("sysadmin.players.banModal.cancel")}
                  </button>
                  <button 
                    type="submit"
                    className={`px-4 py-2 rounded-lg font-medium ${
                      banModal.is_banned 
                        ? 'bg-zinc-800 hover:bg-zinc-700 text-white' 
                        : 'bg-red-500 hover:bg-red-600 text-white'
                    }`}
                  >
                    {banModal.is_banned ? t("sysadmin.players.banModal.confirmUnban") : t("sysadmin.players.banModal.confirmBan")}
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
