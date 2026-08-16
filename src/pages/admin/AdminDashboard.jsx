import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  CalendarDays,
  Gift,
  Receipt,
  ArrowUpRight,
  Clock,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { demoKPIs, demoRevenueChart, demoRecentActivity } from '@/lib/demoData';

const kpiCards = [
  {
    label: 'TOTAL REVENUE',
    value: `$${demoKPIs.totalRevenue.value.toLocaleString()}`,
    change: demoKPIs.totalRevenue.change,
    icon: DollarSign,
    color: '#C8E650',
  },
  {
    label: 'ACTIVE EVENTS',
    value: demoKPIs.activeEvents.value,
    change: demoKPIs.activeEvents.change,
    icon: CalendarDays,
    color: '#E85D4A',
  },
  {
    label: 'REDEMPTIONS',
    value: demoKPIs.totalRedemptions.value,
    change: demoKPIs.totalRedemptions.change,
    icon: Gift,
    color: '#6B9FD4',
  },
  {
    label: 'EXPENSES',
    value: `$${demoKPIs.monthlyExpenses.value.toLocaleString()}`,
    change: demoKPIs.monthlyExpenses.change,
    icon: Receipt,
    color: '#D47BA8',
  },
];

const activityIcons = {
  redemption: '🎁',
  payment: '💳',
  event: '📅',
  expense: '💸',
};

function KPICard({ label, value, change, icon: Icon, color, index }) {
  const isPositive = change >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-card border border-border p-5 relative group hover:border-opacity-60 transition-all"
      style={{ '--kpi-color': color }}
    >
      <div className="absolute top-0 left-0 w-full h-0.5" style={{ backgroundColor: color, opacity: 0.6 }} />
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 flex items-center justify-center border-2"
          style={{ borderColor: color + '44', backgroundColor: color + '11' }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div className={`flex items-center gap-1 font-pixel text-[7px] tracking-wider ${
          isPositive ? 'text-[#C8E650]' : 'text-[#E85D4A]'
        }`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {isPositive ? '+' : ''}{change}%
        </div>
      </div>
      <p className="font-pixel text-[clamp(1rem,2.5vw,1.5rem)] text-foreground mb-1" style={{ textShadow: `0 0 12px ${color}44` }}>
        {value}
      </p>
      <p className="font-pixel text-[6px] text-muted-foreground tracking-widest">{label}</p>
    </motion.div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border-2 border-border p-3">
        <p className="font-pixel text-[8px] text-foreground mb-2 tracking-wider">{label}</p>
        <p className="font-body text-xs text-[#C8E650]">Revenue: ${payload[0]?.value?.toLocaleString()}</p>
        <p className="font-body text-xs text-[#E85D4A]">Expenses: ${payload[1]?.value?.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-pixel text-[clamp(0.7rem,2vw,1rem)] text-foreground glow-red mb-2 leading-relaxed">
            DASHBOARD
          </h1>
          <p className="font-body text-sm text-muted-foreground">
            Welcome back! Here's what's happening with your business.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 border border-border px-3 py-2">
          <Clock className="w-3 h-3 text-muted-foreground" />
          <span className="font-pixel text-[7px] text-muted-foreground tracking-wider">
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, i) => (
          <KPICard key={kpi.label} {...kpi} index={i} />
        ))}
      </div>

      {/* Charts + Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-card border border-border p-5"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-pixel text-[9px] text-foreground tracking-wider mb-1">REVENUE vs EXPENSES</h2>
              <p className="font-body text-xs text-muted-foreground">Last 7 months overview</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-[#C8E650]" />
                <span className="font-pixel text-[6px] text-muted-foreground">REVENUE</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-[#E85D4A]" />
                <span className="font-pixel text-[6px] text-muted-foreground">EXPENSES</span>
              </div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={demoRevenueChart}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C8E650" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#C8E650" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E85D4A" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#E85D4A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 12%, 16%)" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: 'hsl(240, 8%, 55%)', fontSize: 10, fontFamily: '"Press Start 2P"' }}
                  axisLine={{ stroke: 'hsl(240, 12%, 16%)' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: 'hsl(240, 8%, 55%)', fontSize: 9 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#C8E650"
                  strokeWidth={2}
                  fill="url(#revenueGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="#E85D4A"
                  strokeWidth={2}
                  fill="url(#expenseGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card border border-border p-5"
        >
          <h2 className="font-pixel text-[9px] text-foreground tracking-wider mb-1">RECENT ACTIVITY</h2>
          <p className="font-body text-xs text-muted-foreground mb-4">Latest updates</p>
          <div className="space-y-3">
            {demoRecentActivity.slice(0, 6).map((act) => (
              <div key={act.id} className="flex items-start gap-3 py-2 border-b border-border/50 last:border-0">
                <span className="text-lg flex-shrink-0 mt-0.5">{activityIcons[act.type]}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-xs text-foreground leading-relaxed truncate">{act.text}</p>
                  <p className="font-pixel text-[6px] text-muted-foreground mt-1 tracking-wider">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
