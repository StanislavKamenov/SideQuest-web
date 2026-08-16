import React, { useState } from 'react';
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
import { demoEvents } from '@/lib/demoData';

const statusColors = {
  active: { bg: 'bg-[#C8E650]/10', text: 'text-[#C8E650]', border: 'border-[#C8E650]/40' },
  upcoming: { bg: 'bg-[#6B9FD4]/10', text: 'text-[#6B9FD4]', border: 'border-[#6B9FD4]/40' },
  completed: { bg: 'bg-muted', text: 'text-muted-foreground', border: 'border-border' },
  draft: { bg: 'bg-[#E8956A]/10', text: 'text-[#E8956A]', border: 'border-[#E8956A]/40' },
};

const categoryEmoji = {
  health: '💪',
  mind: '🧠',
  social: '🤝',
};

export default function AdminEvents() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filtered = demoEvents.filter((e) => {
    const matchesFilter = filter === 'all' || e.status === filter;
    const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const statusCounts = {
    all: demoEvents.length,
    active: demoEvents.filter((e) => e.status === 'active').length,
    upcoming: demoEvents.filter((e) => e.status === 'upcoming').length,
    completed: demoEvents.filter((e) => e.status === 'completed').length,
    draft: demoEvents.filter((e) => e.status === 'draft').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-pixel text-[clamp(0.7rem,2vw,1rem)] text-foreground glow-red mb-2 leading-relaxed">
            EVENTS
          </h1>
          <p className="font-body text-sm text-muted-foreground">
            Manage your missions and challenges
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-[#E85D4A] text-white px-4 py-2.5 font-pixel text-[8px] tracking-wider hover:bg-[#d44d3a] transition-colors"
        >
          <Plus className="w-4 h-4" />
          CREATE EVENT
        </button>
      </div>

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card border border-border pl-10 pr-4 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-[#E85D4A] focus:outline-none transition-colors"
          />
        </div>
        {/* Status Tabs */}
        <div className="flex items-center gap-1 bg-card border border-border p-1">
          {['all', 'active', 'upcoming', 'completed', 'draft'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 font-pixel text-[7px] tracking-wider transition-all ${
                filter === s
                  ? 'bg-[#E85D4A]/20 text-[#E85D4A]'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {s.toUpperCase()} ({statusCounts[s]})
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
                  {event.status.toUpperCase()}
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
              <p className="font-pixel text-[6px] text-muted-foreground mt-1 text-right">{progress}% FULL</p>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="font-pixel text-[9px] text-muted-foreground tracking-wider">NO EVENTS FOUND</p>
        </div>
      )}

      {/* Create Event Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50"
              onClick={() => setShowCreateModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg bg-card border-2 border-border p-6 z-50 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-pixel text-[10px] text-foreground tracking-wider glow-red">CREATE EVENT</h2>
                <button onClick={() => setShowCreateModal(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowCreateModal(false); }}>
                <div>
                  <label className="font-pixel text-[7px] text-muted-foreground tracking-widest mb-1.5 block">EVENT NAME</label>
                  <input className="w-full bg-background border-2 border-border px-4 py-2.5 font-body text-sm text-foreground focus:border-[#E85D4A] focus:outline-none" placeholder="e.g. Morning Run Challenge" />
                </div>
                <div>
                  <label className="font-pixel text-[7px] text-muted-foreground tracking-widest mb-1.5 block">DESCRIPTION</label>
                  <textarea rows={3} className="w-full bg-background border-2 border-border px-4 py-2.5 font-body text-sm text-foreground focus:border-[#E85D4A] focus:outline-none resize-none" placeholder="What's this event about?" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-pixel text-[7px] text-muted-foreground tracking-widest mb-1.5 block">START DATE</label>
                    <input type="date" className="w-full bg-background border-2 border-border px-4 py-2.5 font-body text-sm text-foreground focus:border-[#E85D4A] focus:outline-none" />
                  </div>
                  <div>
                    <label className="font-pixel text-[7px] text-muted-foreground tracking-widest mb-1.5 block">END DATE</label>
                    <input type="date" className="w-full bg-background border-2 border-border px-4 py-2.5 font-body text-sm text-foreground focus:border-[#E85D4A] focus:outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-pixel text-[7px] text-muted-foreground tracking-widest mb-1.5 block">LOCATION</label>
                    <input className="w-full bg-background border-2 border-border px-4 py-2.5 font-body text-sm text-foreground focus:border-[#E85D4A] focus:outline-none" placeholder="City or Online" />
                  </div>
                  <div>
                    <label className="font-pixel text-[7px] text-muted-foreground tracking-widest mb-1.5 block">XP REWARD</label>
                    <input type="number" className="w-full bg-background border-2 border-border px-4 py-2.5 font-body text-sm text-foreground focus:border-[#E85D4A] focus:outline-none" placeholder="100" />
                  </div>
                </div>
                <div>
                  <label className="font-pixel text-[7px] text-muted-foreground tracking-widest mb-1.5 block">CATEGORY</label>
                  <select className="w-full bg-background border-2 border-border px-4 py-2.5 font-body text-sm text-foreground focus:border-[#E85D4A] focus:outline-none">
                    <option value="health">💪 Health</option>
                    <option value="mind">🧠 Mind</option>
                    <option value="social">🤝 Social</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2.5 border border-border font-pixel text-[8px] text-muted-foreground tracking-wider hover:text-foreground transition-colors"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-[#E85D4A] text-white font-pixel text-[8px] tracking-wider hover:bg-[#d44d3a] transition-colors"
                  >
                    CREATE EVENT
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
