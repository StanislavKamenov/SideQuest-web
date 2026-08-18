import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, DollarSign, CalendarDays, Calendar, Building2, CheckCircle, Clock, XCircle, RotateCcw } from 'lucide-react';
import { demoPayments } from '@/lib/demoData';

const statusConfig = {
  completed: { label: 'COMPLETED', color: '#C8E650', icon: CheckCircle },
  pending: { label: 'PENDING', color: '#E8956A', icon: Clock },
  failed: { label: 'FAILED', color: '#E85D4A', icon: XCircle },
  refunded: { label: 'REFUNDED', color: '#6B9FD4', icon: RotateCcw },
};

export default function SysAdminPayments() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = demoPayments.filter((p) => {
    const matchesFilter = filter === 'all' || p.status === filter;
    const matchesSearch = p.customer.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Since demo data uses "2026-08" for current month, let's hardcode it for demo accuracy
  const currentMonthPrefix = '2026-08';
  const currentYearPrefix = '2026';

  const lifetimeRevenue = demoPayments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const thisYearRevenue = demoPayments
    .filter((p) => p.date.startsWith(currentYearPrefix) && p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const thisMonthRevenue = demoPayments
    .filter((p) => p.date.startsWith(currentMonthPrefix) && p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-[#A663E0]" />
          <h1 className="font-pixel text-xl text-foreground tracking-tight">
            PLATFORM REVENUE
          </h1>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border p-5 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <CalendarDays className="w-24 h-24 text-[#4EE6D0]" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 flex items-center justify-center border border-[#4EE6D0]/40 bg-[#4EE6D0]/10">
                <CalendarDays className="w-4 h-4 text-[#4EE6D0]" />
              </div>
              <span className="font-pixel text-[8px] text-muted-foreground tracking-widest">THIS MONTH</span>
            </div>
            <p className="font-pixel text-3xl text-foreground">${thisMonthRevenue.toLocaleString()}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border p-5 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Calendar className="w-24 h-24 text-[#C8E650]" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 flex items-center justify-center border border-[#C8E650]/40 bg-[#C8E650]/10">
                <Calendar className="w-4 h-4 text-[#C8E650]" />
              </div>
              <span className="font-pixel text-[8px] text-muted-foreground tracking-widest">THIS YEAR</span>
            </div>
            <p className="font-pixel text-3xl text-foreground">${thisYearRevenue.toLocaleString()}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border p-5 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <DollarSign className="w-24 h-24 text-[#A663E0]" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 flex items-center justify-center border border-[#A663E0]/40 bg-[#A663E0]/10">
                <DollarSign className="w-4 h-4 text-[#A663E0]" />
              </div>
              <span className="font-pixel text-[8px] text-muted-foreground tracking-widest">LIFETIME</span>
            </div>
            <p className="font-pixel text-3xl text-[#A663E0]" style={{ textShadow: '0 0 10px rgba(166, 99, 224, 0.4)' }}>
              ${lifetimeRevenue.toLocaleString()}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by business name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card border border-border pl-10 pr-4 py-3 font-body text-sm text-foreground focus:border-[#A663E0] focus:outline-none transition-colors"
          />
        </div>
        <div className="flex items-center gap-1 bg-card border border-border p-1">
          {['all', 'completed', 'pending', 'failed', 'refunded'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 font-pixel text-[8px] tracking-wider transition-all ${
                filter === s
                  ? 'bg-[#A663E0]/20 text-[#A663E0]'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {s.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border overflow-hidden">
        <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 border-b border-border bg-secondary/30">
          <span className="col-span-4 font-pixel text-[6px] text-muted-foreground tracking-widest">BUSINESS</span>
          <span className="col-span-2 font-pixel text-[6px] text-muted-foreground tracking-widest">AMOUNT</span>
          <span className="col-span-2 font-pixel text-[6px] text-muted-foreground tracking-widest">DATE</span>
          <span className="col-span-2 font-pixel text-[6px] text-muted-foreground tracking-widest">METHOD</span>
          <span className="col-span-2 font-pixel text-[6px] text-muted-foreground tracking-widest text-right">STATUS</span>
        </div>

        {filtered.map((p, i) => {
          const sc = statusConfig[p.status];
          const StatusIcon = sc.icon;
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-5 py-4 border-b border-border/50 hover:bg-secondary/20 transition-colors items-center"
            >
              <div className="col-span-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-secondary/50 border border-border flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <span className="font-body text-sm text-foreground block">{p.customer}</span>
                  <span className="font-pixel text-[7px] text-muted-foreground tracking-wider">{p.invoice}</span>
                </div>
              </div>
              <div className="col-span-2">
                <span className="font-pixel text-[10px] text-foreground">${p.amount.toLocaleString()}</span>
              </div>
              <div className="col-span-2">
                <span className="font-body text-xs text-muted-foreground">{p.date}</span>
              </div>
              <div className="col-span-2">
                <span className="font-body text-xs text-muted-foreground">{p.method}</span>
              </div>
              <div className="col-span-2 flex justify-end">
                <span
                  className="inline-flex items-center gap-1 px-2 py-1 font-pixel text-[7px] tracking-wider"
                  style={{ color: sc.color, backgroundColor: sc.color + '15', border: `1px solid ${sc.color}44` }}
                >
                  <StatusIcon className="w-3 h-3" />
                  {sc.label}
                </span>
              </div>
            </motion.div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="font-pixel text-[9px] text-muted-foreground tracking-wider">NO PAYMENTS FOUND</p>
          </div>
        )}
      </div>
    </div>
  );
}
