import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, X, Ticket, Zap, Coins } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/lib/AuthContext';

export default function AdminRewards() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('active');
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { user } = useAuth();
  const [rewards, setRewards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [costCoins, setCostCoins] = useState('100');
  const [costXp, setCostXp] = useState('0');
  const [stock, setStock] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [codeType, setCodeType] = useState('generated');
  const [sharedCode, setSharedCode] = useState('');
  const [uniqueCodes, setUniqueCodes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const fetchRewards = async () => {
    try {
      setIsLoading(true);
      // Fetch user's business
      const { data: biz } = await supabase
        .from('businesses')
        .select('id')
        .eq('owner_id', user.id)
        .single();
      
      if (!biz) {
        setRewards([]);
        return;
      }

      const { data, error } = await supabase
        .from('rewards')
        .select('*')
        .eq('business_id', biz.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRewards(data || []);
    } catch (err) {
      console.error('Failed to load rewards:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchRewards();
  }, [user]);

  const handleCreateReward = async (e) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    try {
      const { data: biz, error: bizError } = await supabase
        .from('businesses')
        .select('id, name')
        .eq('owner_id', user.id)
        .single();

      if (bizError || !biz) throw new Error("Could not find your business profile.");

      const rewardData = {
        source: 'standalone',
        business_id: biz.id,
        partner_name: biz.name,
        title: title.trim(),
        description: description.trim(),
        code_type: codeType,
        shared_code: codeType === 'shared' ? sharedCode.trim() : null,
        cost_coins: parseInt(costCoins) || 0,
        cost_xp: parseInt(costXp) || 0,
        stock: stock.trim() ? parseInt(stock) : null,
        is_active: isActive
      };

      const { data: newRewards, error: rewardError } = await supabase
        .from('rewards')
        .insert(rewardData)
        .select('id');

      if (rewardError) throw rewardError;

      if (newRewards?.length > 0 && codeType === 'unique') {
        const rewardId = newRewards[0].id;
        const codes = uniqueCodes.split(/[\n,]+/).map(c => c.trim()).filter(c => c.length > 0);
        if (codes.length > 0) {
          const uniqueCodesData = codes.map(c => ({
            reward_id: rewardId,
            business_id: biz.id,
            code: c
          }));
          await supabase.from('reward_unique_codes').insert(uniqueCodesData);
          await supabase.from('rewards').update({ stock: codes.length }).eq('id', rewardId);
        }
      }

      setShowCreateModal(false);
      setTitle('');
      setDescription('');
      setCostCoins('100');
      setCostXp('0');
      setStock('');
      setCodeType('generated');
      setSharedCode('');
      setUniqueCodes('');
      setIsActive(true);
      fetchRewards();
    } catch (err) {
      console.error('Error creating reward:', err);
      setFormError(err.message || 'Failed to create reward. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = rewards.filter((r) => {
    const matchesFilter = filter === 'active' ? r.is_active : !r.is_active;
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-pixel text-[clamp(0.7rem,2vw,1rem)] text-foreground glow-red mb-2 leading-relaxed">
            Rewards & Coupons
          </h1>
          <p className="font-body text-sm text-muted-foreground">
            Create and manage rewards for the marketplace.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-[#E85D4A] text-white px-4 py-2.5 font-pixel text-[8px] tracking-wider hover:bg-[#d44d3a] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Reward
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search rewards..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card border border-border pl-10 pr-4 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-[#E85D4A] focus:outline-none transition-colors"
          />
        </div>
        <div className="flex flex-wrap items-center gap-1 bg-card border border-border p-1">
          {['active', 'inactive'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 font-pixel text-[7px] tracking-wider transition-all ${filter === s
                  ? 'bg-[#E85D4A]/20 text-[#E85D4A]'
                  : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              {s.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((reward, i) => (
          <motion.div
            key={reward.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card border border-border p-5 hover:border-[#E85D4A]/40 transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-[#E8C36A]" />
                <h3 className="font-pixel text-[8px] text-foreground tracking-wide leading-relaxed">
                  {reward.title}
                </h3>
              </div>
              <span className={`px-2 py-0.5 font-pixel text-[6px] tracking-wider border ${reward.is_active ? 'bg-[#C8E650]/10 text-[#C8E650] border-[#C8E650]/40' : 'bg-muted/50 text-muted-foreground border-border/50'}`}>
                {reward.is_active ? 'LIVE' : 'OFF'}
              </span>
            </div>

            <p className="font-body text-xs text-muted-foreground mb-4 line-clamp-2">
              {reward.description || 'No description provided.'}
            </p>

            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4">
                {reward.cost_coins > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Coins className="w-3 h-3 text-[#E8C36A]" />
                    <span className="font-pixel text-[7px] text-[#E8C36A]">
                      {reward.cost_coins}
                    </span>
                  </div>
                )}
                {reward.cost_xp > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-3 h-3 text-[#C8E650]" />
                    <span className="font-pixel text-[7px] text-[#C8E650]">
                      {reward.cost_xp} XP
                    </span>
                  </div>
                )}
              </div>
              <span className="font-pixel text-[6px] text-muted-foreground">
                Stock: {reward.stock != null ? reward.stock : '∞'}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && !isLoading && (
        <div className="text-center py-16">
          <p className="font-pixel text-[9px] text-muted-foreground tracking-wider">No rewards found.</p>
        </div>
      )}

      {/* Create Modal */}
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
              className="relative w-full max-w-xl bg-card border border-[#E8C36A]/30 shadow-[0_0_30px_rgba(232,195,106,0.1)] p-6 z-10 overflow-y-auto max-h-[90vh] custom-scrollbar"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                <div>
                  <h2 className="font-pixel text-[12px] text-foreground tracking-widest text-[#E8C36A]">Create Reward</h2>
                  <p className="font-body text-xs text-muted-foreground mt-1">Add a new coupon or prize to the marketplace.</p>
                </div>
                <button onClick={() => setShowCreateModal(false)} className="text-muted-foreground hover:text-foreground bg-secondary/50 p-2">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form className="space-y-6" onSubmit={handleCreateReward}>
                {formError && (
                  <div className="bg-red-500/10 border border-red-500/50 p-4">
                    <p className="font-pixel text-[8px] text-red-500 tracking-wider">{formError}</p>
                  </div>
                )}

                <div>
                  <label className="font-pixel text-[8px] text-[#6B9FD4] tracking-widest mb-3 block">Reward Details</label>
                  <div className="space-y-4">
                    <div>
                      <span className="font-pixel text-[6px] text-muted-foreground tracking-widest block mb-1.5">Title</span>
                      <input
                        value={title} onChange={(e) => setTitle(e.target.value)} required
                        className="w-full bg-background border border-border px-4 py-2.5 font-body text-sm focus:border-[#6B9FD4] focus:outline-none"
                        placeholder="e.g. 10% off any latte"
                      />
                    </div>
                    <div>
                      <span className="font-pixel text-[6px] text-muted-foreground tracking-widest block mb-1.5">Description (Optional)</span>
                      <textarea
                        value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
                        className="w-full bg-background border border-border px-4 py-2.5 font-body text-sm focus:border-[#6B9FD4] focus:outline-none resize-none"
                        placeholder="Valid weekdays 8–11am. Cannot combine with other offers."
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="font-pixel text-[8px] text-[#A78BFA] tracking-widest mb-3 block">Code Configuration</label>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {[
                      { id: 'generated', label: 'Generated' },
                      { id: 'shared', label: 'Shared Code' },
                      { id: 'unique', label: 'Unique Codes' }
                    ].map(c => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setCodeType(c.id)}
                        className={`py-2 px-1 font-pixel text-[6px] tracking-wider border transition-all ${codeType === c.id
                            ? 'bg-[#A78BFA]/20 border-[#A78BFA] text-[#A78BFA]'
                            : 'bg-secondary border-border text-muted-foreground hover:bg-secondary/80'
                          }`}
                      >
                        {c.label.toUpperCase()}
                      </button>
                    ))}
                  </div>

                  {codeType === 'shared' && (
                    <div>
                      <span className="font-pixel text-[6px] text-muted-foreground tracking-widest block mb-1.5">Shared Promo Code</span>
                      <input
                        value={sharedCode} onChange={(e) => setSharedCode(e.target.value)} required
                        className="w-full bg-background border border-border px-4 py-2.5 font-body text-sm focus:border-[#A78BFA] focus:outline-none"
                        placeholder="e.g. SUMMER20"
                      />
                    </div>
                  )}

                  {codeType === 'unique' && (
                    <div>
                      <span className="font-pixel text-[6px] text-muted-foreground tracking-widest block mb-1.5">Unique Promo Codes (one per line)</span>
                      <textarea
                        value={uniqueCodes} onChange={(e) => setUniqueCodes(e.target.value)} required rows={4}
                        className="w-full bg-background border border-border px-4 py-2.5 font-body text-sm focus:border-[#A78BFA] focus:outline-none resize-none"
                        placeholder="ABCD123&#10;XYZ987"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="font-pixel text-[8px] text-[#E8C36A] tracking-widest mb-3 block">Cost & Stock</label>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <span className="font-pixel text-[6px] text-muted-foreground tracking-widest block mb-1.5">Coins Cost</span>
                      <input
                        type="number" value={costCoins} onChange={(e) => setCostCoins(e.target.value)}
                        className="w-full bg-background border border-border px-4 py-2.5 font-body text-sm focus:border-[#E8C36A] focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="font-pixel text-[6px] text-muted-foreground tracking-widest block mb-1.5">XP Cost</span>
                      <input
                        type="number" value={costXp} onChange={(e) => setCostXp(e.target.value)}
                        className="w-full bg-background border border-border px-4 py-2.5 font-body text-sm focus:border-[#E8C36A] focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="font-pixel text-[6px] text-muted-foreground tracking-widest block mb-1.5">Stock (Optional)</span>
                      <input
                        type="number" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="∞"
                        className="w-full bg-background border border-border px-4 py-2.5 font-body text-sm focus:border-[#E8C36A] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className={`p-4 border transition-all flex items-center justify-between ${isActive ? 'border-[#6B9FD4]/50 bg-[#6B9FD4]/5' : 'border-border bg-secondary/30'}`}>
                  <div>
                    <p className="font-pixel text-[8px] text-foreground tracking-wider">Active Immediately</p>
                    <p className="font-body text-[10px] text-muted-foreground mt-1">Visible to users in the marketplace.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                    <div className="w-9 h-5 bg-secondary peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#6B9FD4] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#6B9FD4]"></div>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#E8C36A] text-black font-pixel text-[9px] tracking-widest hover:bg-[#d4b05a] transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create Reward'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
