import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, X, DollarSign } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { demoExpenses, demoExpenseCategories } from '@/lib/demoData';

const categoryColors = {
  Marketing: '#E85D4A',
  Operations: '#6B9FD4',
  Rewards: '#C8E650',
  Staff: '#D47BA8',
  Other: '#E8956A',
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border-2 border-border p-3">
        <p className="font-pixel text-[8px] text-foreground tracking-wider mb-1">{payload[0].name}</p>
        <p className="font-body text-xs" style={{ color: payload[0].payload.color }}>
          ${payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }) => (
  <div className="flex flex-wrap gap-3 justify-center mt-2">
    {payload?.map((entry) => (
      <div key={entry.value} className="flex items-center gap-1.5">
        <div className="w-2 h-2" style={{ backgroundColor: entry.color }} />
        <span className="font-pixel text-[6px] text-muted-foreground tracking-wider">{entry.value}</span>
      </div>
    ))}
  </div>
);

export default function AdminExpenses() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const categories = ['all', ...Object.keys(categoryColors)];

  const filtered = demoExpenses.filter((e) => {
    const matchesCategory = categoryFilter === 'all' || e.category === categoryFilter;
    const matchesSearch = e.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalExpenses = demoExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-pixel text-[clamp(0.7rem,2vw,1rem)] text-foreground glow-red mb-2 leading-relaxed">
            EXPENSES
          </h1>
          <p className="font-body text-sm text-muted-foreground">
            Track and categorize your business expenses
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-[#E85D4A] text-white px-4 py-2.5 font-pixel text-[8px] tracking-wider hover:bg-[#d44d3a] transition-colors"
        >
          <Plus className="w-4 h-4" />
          ADD EXPENSE
        </button>
      </div>

      {/* Total + Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Total Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border p-5"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 flex items-center justify-center border-2 border-[#E85D4A]/40 bg-[#E85D4A]/10">
              <DollarSign className="w-5 h-5 text-[#E85D4A]" />
            </div>
            <span className="font-pixel text-[7px] text-muted-foreground tracking-widest">TOTAL EXPENSES</span>
          </div>
          <p className="font-pixel text-[clamp(1.2rem,3vw,1.8rem)] text-foreground mb-2" style={{ textShadow: '0 0 12px #E85D4A44' }}>
            ${totalExpenses.toLocaleString()}
          </p>
          <p className="font-pixel text-[6px] text-muted-foreground tracking-wider">THIS MONTH</p>

          {/* Category breakdown mini list */}
          <div className="mt-4 space-y-2">
            {demoExpenseCategories.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2" style={{ backgroundColor: cat.color }} />
                  <span className="font-body text-xs text-muted-foreground">{cat.name}</span>
                </div>
                <span className="font-pixel text-[8px] text-foreground">${cat.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-card border border-border p-5"
        >
          <h2 className="font-pixel text-[9px] text-foreground tracking-wider mb-1">EXPENSE BREAKDOWN</h2>
          <p className="font-body text-xs text-muted-foreground mb-4">Distribution by category</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={demoExpenseCategories}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {demoExpenseCategories.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} stroke="hsl(240, 15%, 5%)" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend content={<CustomLegend />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Search + Category Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search expenses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card border border-border pl-10 pr-4 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-[#E85D4A] focus:outline-none transition-colors"
          />
        </div>
        <div className="flex items-center gap-1 bg-card border border-border p-1 overflow-x-auto">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={`px-3 py-1.5 font-pixel text-[7px] tracking-wider transition-all whitespace-nowrap ${
                categoryFilter === c
                  ? 'bg-[#E85D4A]/20 text-[#E85D4A]'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {c.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-card border border-border overflow-hidden">
        <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 border-b border-border bg-secondary/30">
          <span className="col-span-5 font-pixel text-[6px] text-muted-foreground tracking-widest">DESCRIPTION</span>
          <span className="col-span-2 font-pixel text-[6px] text-muted-foreground tracking-widest">CATEGORY</span>
          <span className="col-span-3 font-pixel text-[6px] text-muted-foreground tracking-widest">DATE</span>
          <span className="col-span-2 font-pixel text-[6px] text-muted-foreground tracking-widest text-right">AMOUNT</span>
        </div>

        {filtered.map((e, i) => (
          <motion.div
            key={e.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.03 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-5 py-4 border-b border-border/50 hover:bg-secondary/20 transition-colors items-center"
          >
            <div className="col-span-5">
              <span className="font-body text-sm text-foreground">{e.description}</span>
            </div>
            <div className="col-span-2">
              <span
                className="inline-flex items-center gap-1.5 px-2 py-0.5 font-pixel text-[6px] tracking-wider"
                style={{
                  color: categoryColors[e.category],
                  backgroundColor: categoryColors[e.category] + '15',
                  border: `1px solid ${categoryColors[e.category]}44`,
                }}
              >
                {e.category.toUpperCase()}
              </span>
            </div>
            <div className="col-span-3">
              <span className="font-body text-xs text-muted-foreground">{e.date}</span>
            </div>
            <div className="col-span-2 text-right">
              <span className="font-pixel text-[10px] text-[#E85D4A]">-${e.amount.toLocaleString()}</span>
            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="font-pixel text-[9px] text-muted-foreground tracking-wider">NO EXPENSES FOUND</p>
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/60 z-50"
            onClick={() => setShowAddModal(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md bg-card border-2 border-border p-6 z-50"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-pixel text-[10px] text-foreground tracking-wider glow-red">ADD EXPENSE</h2>
              <button onClick={() => setShowAddModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowAddModal(false); }}>
              <div>
                <label className="font-pixel text-[7px] text-muted-foreground tracking-widest mb-1.5 block">DESCRIPTION</label>
                <input className="w-full bg-background border-2 border-border px-4 py-2.5 font-body text-sm text-foreground focus:border-[#E85D4A] focus:outline-none" placeholder="What was this expense for?" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-pixel text-[7px] text-muted-foreground tracking-widest mb-1.5 block">AMOUNT ($)</label>
                  <input type="number" className="w-full bg-background border-2 border-border px-4 py-2.5 font-body text-sm text-foreground focus:border-[#E85D4A] focus:outline-none" placeholder="0.00" />
                </div>
                <div>
                  <label className="font-pixel text-[7px] text-muted-foreground tracking-widest mb-1.5 block">DATE</label>
                  <input type="date" className="w-full bg-background border-2 border-border px-4 py-2.5 font-body text-sm text-foreground focus:border-[#E85D4A] focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="font-pixel text-[7px] text-muted-foreground tracking-widest mb-1.5 block">CATEGORY</label>
                <select className="w-full bg-background border-2 border-border px-4 py-2.5 font-body text-sm text-foreground focus:border-[#E85D4A] focus:outline-none">
                  {Object.keys(categoryColors).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2.5 border border-border font-pixel text-[8px] text-muted-foreground tracking-wider hover:text-foreground transition-colors"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-[#E85D4A] text-white font-pixel text-[8px] tracking-wider hover:bg-[#d44d3a] transition-colors"
                >
                  ADD EXPENSE
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </div>
  );
}
