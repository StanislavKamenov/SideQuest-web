import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, CheckCircle, XCircle, Clock, Gift } from 'lucide-react';
import { demoRedemptions } from '@/lib/demoData';

const statusConfig = {
  pending: { label: 'PENDING', color: '#E8956A', icon: Clock },
  approved: { label: 'APPROVED', color: '#C8E650', icon: CheckCircle },
  rejected: { label: 'REJECTED', color: '#E85D4A', icon: XCircle },
};

export default function AdminRedemptions() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [redemptions, setRedemptions] = useState(demoRedemptions);

  const filtered = redemptions.filter((r) => {
    const matchesFilter = filter === 'all' || r.status === filter;
    const matchesSearch =
      r.user.toLowerCase().includes(search.toLowerCase()) ||
      r.reward.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleAction = (id, action) => {
    setRedemptions((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: action } : r))
    );
  };

  const counts = {
    all: redemptions.length,
    pending: redemptions.filter((r) => r.status === 'pending').length,
    approved: redemptions.filter((r) => r.status === 'approved').length,
    rejected: redemptions.filter((r) => r.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-pixel text-[clamp(0.7rem,2vw,1rem)] text-foreground glow-red mb-2 leading-relaxed">
          REDEMPTIONS
        </h1>
        <p className="font-body text-sm text-muted-foreground">
          Review and manage reward redemption requests
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Object.entries(counts).map(([key, count]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`bg-card border p-4 text-center transition-all ${
              filter === key ? 'border-[#E85D4A]/60' : 'border-border hover:border-border/80'
            }`}
          >
            <p className="font-pixel text-[clamp(0.9rem,2vw,1.3rem)] text-foreground mb-1">{count}</p>
            <p className="font-pixel text-[6px] text-muted-foreground tracking-widest">{key.toUpperCase()}</p>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by user or reward..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-card border border-border pl-10 pr-4 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-[#E85D4A] focus:outline-none transition-colors"
        />
      </div>

      {/* Table */}
      <div className="bg-card border border-border overflow-hidden">
        {/* Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 border-b border-border bg-secondary/30">
          <span className="col-span-3 font-pixel text-[6px] text-muted-foreground tracking-widest">USER</span>
          <span className="col-span-3 font-pixel text-[6px] text-muted-foreground tracking-widest">REWARD</span>
          <span className="col-span-1 font-pixel text-[6px] text-muted-foreground tracking-widest">XP</span>
          <span className="col-span-2 font-pixel text-[6px] text-muted-foreground tracking-widest">DATE</span>
          <span className="col-span-1 font-pixel text-[6px] text-muted-foreground tracking-widest">STATUS</span>
          <span className="col-span-2 font-pixel text-[6px] text-muted-foreground tracking-widest text-right">ACTIONS</span>
        </div>

        {/* Rows */}
        {filtered.map((r, i) => {
          const sc = statusConfig[r.status];
          const StatusIcon = sc.icon;
          return (
            <motion.div
              key={r.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-5 py-4 border-b border-border/50 hover:bg-secondary/20 transition-colors items-center"
            >
              {/* User */}
              <div className="col-span-3 flex items-center gap-3">
                <span className="text-lg">{r.avatar}</span>
                <span className="font-body text-sm text-foreground">{r.user}</span>
              </div>
              {/* Reward */}
              <div className="col-span-3 flex items-center gap-2">
                <Gift className="w-3 h-3 text-[#C8E650] flex-shrink-0 hidden md:block" />
                <span className="font-body text-sm text-muted-foreground">{r.reward}</span>
              </div>
              {/* XP */}
              <div className="col-span-1">
                <span className="font-pixel text-[8px] text-[#C8E650]">{r.xpCost}</span>
              </div>
              {/* Date */}
              <div className="col-span-2">
                <span className="font-body text-xs text-muted-foreground">{r.date}</span>
              </div>
              {/* Status */}
              <div className="col-span-1">
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 font-pixel text-[6px] tracking-wider"
                  style={{ color: sc.color, backgroundColor: sc.color + '15', border: `1px solid ${sc.color}44` }}
                >
                  <StatusIcon className="w-2.5 h-2.5" />
                  {sc.label}
                </span>
              </div>
              {/* Actions */}
              <div className="col-span-2 flex items-center gap-2 justify-end">
                {r.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleAction(r.id, 'approved')}
                      className="px-2.5 py-1 font-pixel text-[6px] tracking-wider text-[#C8E650] border border-[#C8E650]/40 hover:bg-[#C8E650]/10 transition-colors"
                    >
                      APPROVE
                    </button>
                    <button
                      onClick={() => handleAction(r.id, 'rejected')}
                      className="px-2.5 py-1 font-pixel text-[6px] tracking-wider text-[#E85D4A] border border-[#E85D4A]/40 hover:bg-[#E85D4A]/10 transition-colors"
                    >
                      REJECT
                    </button>
                  </>
                )}
                {r.status !== 'pending' && (
                  <span className="font-pixel text-[6px] text-muted-foreground/50 tracking-wider">—</span>
                )}
              </div>
            </motion.div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="font-pixel text-[9px] text-muted-foreground tracking-wider">NO REDEMPTIONS FOUND</p>
          </div>
        )}
      </div>
    </div>
  );
}
