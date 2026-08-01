import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/landing/Navbar';
import FooterCTA from '../components/landing/FooterCTA';

const MOCK_POSTS = [
  {
    id: 1,
    type: 'image',
    src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
    player: 'ALEX_99',
    rank: 'WARRIOR',
    rankColor: '#6B9FD4',
    mission: 'Morning Run',
    category: 'BODY',
    categoryColor: '#E85D4A',
    xp: '+80 XP',
    time: '2H AGO',
    caption: 'Early morning 5K. The streets are empty but the grind never stops.',
    verified: true,
  },
  {
    id: 2,
    type: 'video',
    src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
    player: 'STAN_K',
    rank: 'EXPLORER',
    rankColor: '#C8E650',
    mission: 'Coffee with friend',
    category: 'SOCIAL',
    categoryColor: '#7BC67E',
    xp: '+60 XP',
    time: '4H AGO',
    caption: 'Met an old friend for coffee IRL. No phones during the whole conversation.',
    verified: true,
  },
  {
    id: 3,
    type: 'image',
    src: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80',
    player: 'NOVA_XR',
    rank: 'RECRUIT',
    rankColor: '#E8956A',
    mission: 'Read 20 pages',
    category: 'MIND',
    categoryColor: '#6B9FD4',
    xp: '+50 XP',
    time: '6H AGO',
    caption: 'Finished chapter 3 of Atomic Habits. Building systems, not goals.',
    verified: false,
  },
  {
    id: 4,
    type: 'image',
    src: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80',
    player: 'IRON_MIKE',
    rank: 'LEGEND',
    rankColor: '#E85D4A',
    mission: 'Gym Session',
    category: 'BODY',
    categoryColor: '#E85D4A',
    xp: '+100 XP',
    time: '8H AGO',
    caption: 'Pull day done. Back and biceps. 4th session this week.',
    verified: true,
  },
  {
    id: 5,
    type: 'video',
    src: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80',
    player: 'MILA_G',
    rank: 'WARRIOR',
    rankColor: '#6B9FD4',
    mission: 'Meet 3 strangers',
    category: 'SOCIAL',
    categoryColor: '#7BC67E',
    xp: '+90 XP',
    time: '10H AGO',
    caption: 'Approached three random people and had a genuine conversation. Scary but worth it.',
    verified: true,
  },
  {
    id: 6,
    type: 'image',
    src: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&q=80',
    player: 'ZEN_MODE',
    rank: 'EXPLORER',
    rankColor: '#C8E650',
    mission: 'Meditate 15 min',
    category: 'MIND',
    categoryColor: '#6B9FD4',
    xp: '+40 XP',
    time: '12H AGO',
    caption: '15 minutes of silence. No distractions, no phone. Pure focus.',
    verified: true,
  },
];

const CATEGORIES = ['ALL', 'BODY', 'SOCIAL', 'MIND'];

const categoryColors = {
  BODY: '#E85D4A',
  SOCIAL: '#7BC67E',
  MIND: '#6B9FD4',
  ALL: '#C8E650',
};

function ProofCard({ post, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className="bg-card border border-border hover:border-[#E85D4A]/50 transition-all group overflow-hidden"
    >
      {/* Image / Video Thumbnail */}
      <div className="relative overflow-hidden">
        <img
          src={post.src}
          alt={post.mission}
          className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Scanline overlay on image */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 6px)',
          }}
        />
        {/* Category badge */}
        <div
          className="absolute top-2 left-2 font-pixel text-[7px] px-2 py-1 border"
          style={{
            color: post.categoryColor,
            borderColor: post.categoryColor + '88',
            backgroundColor: post.categoryColor + '22',
            textShadow: `0 0 8px ${post.categoryColor}`,
          }}
        >
          {post.category}
        </div>
        {/* Video indicator */}
        {post.type === 'video' && (
          <div className="absolute top-2 right-2 font-pixel text-[7px] px-2 py-1 border border-white/30 bg-black/60 text-white">
            ▶ VIDEO
          </div>
        )}
        {/* XP badge */}
        <div
          className="absolute bottom-2 right-2 font-pixel text-[8px] px-2 py-1"
          style={{
            color: '#C8E650',
            backgroundColor: '#0d0d0d',
            border: '1px solid #C8E65066',
            textShadow: '0 0 8px #C8E650',
          }}
        >
          {post.xp}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Player row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 flex items-center justify-center font-pixel text-[6px] border"
              style={{ borderColor: post.rankColor + '88', color: post.rankColor, backgroundColor: post.rankColor + '11' }}
            >
              {post.player[0]}
            </div>
            <div>
              <p className="font-pixel text-[8px] text-foreground">{post.player}</p>
              <p className="font-pixel text-[6px] mt-0.5" style={{ color: post.rankColor }}>{post.rank}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {post.verified && (
              <span className="font-pixel text-[6px] text-green-400 border border-green-400/40 px-1.5 py-0.5">✓ VERIFIED</span>
            )}
            <span className="font-pixel text-[6px] text-muted-foreground">{post.time}</span>
          </div>
        </div>

        {/* Mission label */}
        <p className="font-pixel text-[8px] text-foreground mb-2 leading-relaxed" style={{ color: post.categoryColor }}>
          ▸ {post.mission.toUpperCase()}
        </p>

        {/* Caption */}
        <p className="font-body text-sm text-muted-foreground leading-relaxed">{post.caption}</p>
      </div>
    </motion.div>
  );
}

export default function ProofFeed() {
  const [activeCategory, setActiveCategory] = useState('ALL');

  const filtered = activeCategory === 'ALL'
    ? MOCK_POSTS
    : MOCK_POSTS.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Banner */}
      <section className="pt-24 pb-12 relative pixel-grid overflow-hidden">
        {/* Corner decorations */}
        <div className="absolute top-20 left-4 w-px h-16 bg-[#E85D4A]/30" />
        <div className="absolute top-20 left-4 w-16 h-px bg-[#E85D4A]/30" />
        <div className="absolute top-20 right-4 w-px h-16 bg-[#C8E650]/30" />
        <div className="absolute top-20 right-4 w-16 h-px bg-[#C8E650]/30" />

        <div className="max-w-6xl mx-auto px-5 md:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 border border-[#E85D4A]/40 px-3 py-1.5 mb-6">
              <span className="w-2 h-2 bg-[#E85D4A] animate-pulse" />
              <span className="font-pixel text-[8px] text-[#E85D4A] tracking-widest">LIVE PROOF FEED</span>
            </div>
            <h1 className="font-pixel text-[clamp(0.9rem,3vw,1.8rem)] text-foreground glow-red leading-relaxed mb-4">
              PROOF OF LIFE
            </h1>
            <p className="font-body text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Real missions. Real people. Real proof. Every photo and video uploaded by SideQuest players — verified and logged.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center gap-10 mt-10"
          >
            {[
              { value: '1,248', label: 'PROOFS TODAY' },
              { value: '347', label: 'ACTIVE PLAYERS' },
              { value: '89%', label: 'VERIFIED RATE' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="font-pixel text-lg text-[#E85D4A] glow-red">{s.value}</p>
                <p className="font-pixel text-[7px] text-muted-foreground mt-1 tracking-wider">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="border-y border-border bg-card/50">
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-4 flex items-center gap-3 overflow-x-auto">
          <span className="font-pixel text-[7px] text-muted-foreground tracking-wider flex-shrink-0">FILTER:</span>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="font-pixel text-[8px] px-3 py-2 border flex-shrink-0 transition-all"
              style={{
                borderColor: activeCategory === cat ? categoryColors[cat] : 'hsl(var(--border))',
                color: activeCategory === cat ? categoryColors[cat] : 'hsl(var(--muted-foreground))',
                backgroundColor: activeCategory === cat ? categoryColors[cat] + '11' : 'transparent',
                textShadow: activeCategory === cat ? `0 0 8px ${categoryColors[cat]}` : 'none',
              }}
            >
              {cat}
            </button>
          ))}
          <div className="ml-auto font-pixel text-[7px] text-muted-foreground flex-shrink-0">
            {filtered.length} ENTRIES
          </div>
        </div>
      </div>

      {/* Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((post, i) => (
              <ProofCard key={post.id} post={post} index={i} />
            ))}
          </div>

          {/* Load more placeholder */}
          <div className="text-center mt-12">
            <div className="inline-flex flex-col items-center gap-3">
              <div className="font-pixel text-[7px] text-muted-foreground tracking-widest">
                — API FEED WILL LOAD MORE —
              </div>
              <button className="font-pixel text-[8px] border border-[#E85D4A]/50 text-[#E85D4A] px-8 py-3 hover:bg-[#E85D4A]/10 transition-colors">
                LOAD MORE
              </button>
            </div>
          </div>
        </div>
      </section>

      <FooterCTA />
    </div>
  );
}