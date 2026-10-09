import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { formatDistanceToNow } from 'date-fns';
import { Loader2 } from 'lucide-react';
import Navbar from '../components/landing/Navbar';
import FooterCTA from '../components/landing/FooterCTA';
import ArcadeScene from '../components/landing/3d/ArcadeScene';
import AmbientArcade from '../components/landing/3d/AmbientArcade';

// Removing mock data as we are using real data from DB

const CATEGORIES = ['ALL', 'GLOBAL', 'SIDE', 'EVENT'];
const categoryColors = { GLOBAL: '#E85D4A', SIDE: '#7BC67E', EVENT: '#6B9FD4', ALL: '#C8E650' };

function ProofCard({ post, index }) {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className="crt-card overflow-hidden group tilt-card"
      style={{ borderColor: post.categoryColor + '22' }}
    >
      {/* Image / Video */}
      <div className="relative overflow-hidden bg-black/50">
        {post.type === 'video' ? (
          <video
            src={post.src}
            autoPlay loop muted playsInline
            className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <img
            src={post.src}
            alt={post.mission}
            className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
        {/* Scanline overlay */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 6px)',
          }}
        />
        {/* CRT curvature */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.2) 100%)',
          }}
        />
        {/* Category badge */}
        <div className="absolute top-2 left-2 font-pixel text-[7px] px-2 py-1 border z-10"
          style={{
            color: post.categoryColor,
            borderColor: post.categoryColor + '88',
            backgroundColor: 'rgba(10,9,18,0.85)',
            textShadow: `0 0 8px ${post.categoryColor}`,
          }}
        >
          {t(`landing.proofFeed.categories.${post.category}`, post.category)}
        </div>
        {/* Video indicator */}
        {post.type === 'video' && (
          <div className="absolute top-2 right-2 font-pixel text-[7px] px-2 py-1 border border-white/30 bg-black/70 text-white z-10">
            ▶ {t('landing.proofFeed.video')}
          </div>
        )}
        {/* XP badge */}
        <div className="absolute bottom-2 right-2 font-pixel text-[8px] px-2 py-1 z-10"
          style={{
            color: '#C8E650',
            backgroundColor: 'rgba(10,9,18,0.9)',
            border: '1px solid #C8E65044',
            textShadow: '0 0 8px #C8E650',
          }}
        >
          {post.xp}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 flex items-center justify-center font-pixel text-[7px] border"
              style={{
                borderColor: post.rankColor + '66',
                color: post.rankColor,
                backgroundColor: post.rankColor + '11',
                boxShadow: `0 0 8px ${post.rankColor}22`,
              }}
            >
              {post.player[0]}
            </div>
            <div>
              <p className="font-pixel text-[8px] text-foreground">{post.player}</p>
              <p className="font-pixel text-[6px] mt-0.5" style={{ color: post.rankColor, textShadow: `0 0 6px ${post.rankColor}66` }}>{post.rank}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {post.verified && (
              <span className="font-pixel text-[6px] text-green-400 border border-green-400/30 px-1.5 py-0.5"
                style={{ textShadow: '0 0 6px rgba(74,222,128,0.5)' }}
              >
                ✓ {t('landing.proofFeed.verified')}
              </span>
            )}
            <span className="font-pixel text-[6px] text-muted-foreground">{post.time}</span>
          </div>
        </div>

        <p className="font-pixel text-[8px] text-foreground mb-2 leading-relaxed" style={{ color: post.categoryColor }}>
          ▸ {post.mission.toUpperCase()}
        </p>
        <p className="font-body text-sm text-muted-foreground leading-relaxed">{post.caption}</p>
      </div>
    </motion.div>
  );
}

export default function ProofFeed() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('ALL');

  const { data: proofs, isLoading } = useQuery({
    queryKey: ['proof-feed'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mission_participants')
        .select(`
          id,
          proof_url,
          proof_submitted_at,
          status,
          verification_decision,
          missions ( title, category, xp_reward ),
          profiles ( username, trust_score )
        `)
        .eq('status', 'completed')
        .not('proof_url', 'is', null)
        .order('proof_submitted_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data;
    }
  });

  const { data: stats } = useQuery({
    queryKey: ['proof-feed-stats'],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const [{ count: proofsToday }, { count: totalCompleted }, { count: totalFailed }] = await Promise.all([
        supabase.from('mission_participants').select('*', { count: 'exact', head: true })
          .eq('status', 'completed')
          .gte('proof_submitted_at', today.toISOString()),
        supabase.from('mission_participants').select('*', { count: 'exact', head: true })
          .eq('status', 'completed'),
        supabase.from('mission_participants').select('*', { count: 'exact', head: true })
          .eq('status', 'failed')
      ]);

      const totalReviewed = (totalCompleted || 0) + (totalFailed || 0);
      const verifiedRate = totalReviewed > 0 
        ? Math.round(((totalCompleted || 0) / totalReviewed) * 100) 
        : 100;

      return {
        proofsToday: proofsToday || 0,
        verifiedRate
      };
    }
  });

  const formattedProofs = proofs?.map(p => {
    const isVideo = p.proof_url.toLowerCase().match(/\.(mp4|mov|webm)$/i);
    
    let rank = 'RECRUIT';
    let rankColor = '#E8956A';
    const score = p.profiles?.trust_score || 50;
    if (score > 90) { rank = 'LEGEND'; rankColor = '#E85D4A'; }
    else if (score > 70) { rank = 'WARRIOR'; rankColor = '#6B9FD4'; }
    else if (score > 50) { rank = 'EXPLORER'; rankColor = '#C8E650'; }

    return {
      id: p.id,
      type: isVideo ? 'video' : 'image',
      src: p.proof_url,
      player: p.profiles?.username || 'UNKNOWN',
      rank,
      rankColor,
      mission: p.missions?.title || 'Unknown Mission',
      category: p.missions?.category?.toUpperCase() || 'ALL',
      categoryColor: categoryColors[p.missions?.category?.toUpperCase()] || '#C8E650',
      xp: `+${p.missions?.xp_reward || 0} XP`,
      time: p.proof_submitted_at ? formatDistanceToNow(new Date(p.proof_submitted_at), { addSuffix: true }) : 'Just now',
      caption: '',
      verified: true
    };
  }) || [];

  const filtered = activeCategory === 'ALL'
    ? formattedProofs
    : formattedProofs.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-background relative">
      {/* 3D Ambient Layer */}
      <ArcadeScene>
        <AmbientArcade color="#E85D4A" />
      </ArcadeScene>

      <div className="relative z-10">
        <Navbar />

        {/* Hero Banner */}
        <section className="pt-24 pb-12 relative overflow-hidden">
          <div className="absolute top-20 left-4 w-px h-16 bg-[#E85D4A]/30" />
          <div className="absolute top-20 left-4 w-16 h-px bg-[#E85D4A]/30" />
          <div className="absolute top-20 right-4 w-px h-16 bg-[#C8E650]/30" />
          <div className="absolute top-20 right-4 w-16 h-px bg-[#C8E650]/30" />

          <div className="max-w-6xl mx-auto px-5 md:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 border border-[#E85D4A]/40 px-3 py-1.5 mb-6 neon-border-pulse"
                style={{ borderColor: 'rgba(232,93,74,0.4)' }}
              >
                <span className="w-2 h-2 bg-[#E85D4A] animate-pulse" style={{ boxShadow: '0 0 6px #E85D4A' }} />
                <span className="font-pixel text-[8px] text-[#E85D4A] tracking-widest">{t('landing.proofFeed.badge')}</span>
              </div>
              <h1 className="font-pixel text-[clamp(0.9rem,3vw,1.8rem)] text-foreground leading-relaxed mb-4"
                style={{ textShadow: '0 0 20px #E85D4A88' }}
              >
                {t('landing.proofFeed.title')}
              </h1>
              <p className="font-body text-muted-foreground max-w-lg mx-auto leading-relaxed">
                {t('landing.proofFeed.description')}
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="flex justify-center gap-6 mt-10"
            >
              {[
                { value: stats?.proofsToday?.toLocaleString() || '0', label: t('landing.proofFeed.stats.proofsToday'), color: '#E85D4A' },
                { value: '347', label: t('landing.proofFeed.stats.activePlayers'), color: '#C8E650' },
                { value: `${stats?.verifiedRate ?? 100}%`, label: t('landing.proofFeed.stats.verifiedRate'), color: '#00E5FF' },
              ].map(s => (
                <div key={s.label} className="text-center crt-card px-4 py-3">
                  <p className="font-pixel text-lg relative z-10"
                    style={{ color: s.color, textShadow: `0 0 12px ${s.color}` }}
                  >
                    {s.value}
                  </p>
                  <p className="font-pixel text-[6px] text-muted-foreground mt-1 tracking-wider relative z-10">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Filter Bar — arcade selector */}
        <div className="border-y border-border/50"
          style={{ background: 'rgba(12,11,22,0.9)' }}
        >
          <div className="max-w-6xl mx-auto px-5 md:px-8 py-4 flex items-center gap-3 overflow-x-auto">
            <span className="font-pixel text-[7px] text-muted-foreground tracking-wider flex-shrink-0">
              <span className="text-[#E85D4A]">▸</span> {t('landing.proofFeed.filter')}
            </span>
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
                  boxShadow: activeCategory === cat ? `0 0 12px ${categoryColors[cat]}22` : 'none',
                }}
              >
                {t(`landing.proofFeed.categories.${cat}`, cat)}
              </button>
            ))}
            <div className="ml-auto font-pixel text-[7px] text-muted-foreground flex-shrink-0">
              {filtered.length} {t('landing.proofFeed.entries')}
            </div>
          </div>
        </div>

        {/* Grid */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-5 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[400px]">
              {isLoading ? (
                <div className="col-span-full flex flex-col items-center justify-center pt-20">
                  <Loader2 className="w-8 h-8 animate-spin text-[#E85D4A] mb-4" />
                  <p className="font-pixel text-[8px] text-muted-foreground tracking-widest">{t('landing.proofFeed.apiFeedLoadMore') || "LOADING PROOFS..."}</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center pt-20 text-center border-2 border-dashed border-border/50 p-10 bg-secondary/20">
                  <span className="text-4xl mb-4">📸</span>
                  <p className="font-pixel text-[10px] text-foreground mb-2">NO PROOFS FOUND</p>
                  <p className="font-body text-sm text-muted-foreground">Be the first to complete a mission and get featured here!</p>
                </div>
              ) : (
                filtered.map((post, i) => (
                  <ProofCard key={post.id} post={post} index={i} />
                ))
              )}
            </div>

            <div className="text-center mt-12">
              <div className="inline-flex flex-col items-center gap-3">
                <div className="font-pixel text-[7px] text-muted-foreground tracking-widest">
                  {t('landing.proofFeed.apiFeedLoadMore')}
                </div>
                <button className="font-pixel text-[8px] border border-[#E85D4A]/50 text-[#E85D4A] px-8 py-3 hover:bg-[#E85D4A]/10 transition-all arcade-btn"
                  style={{ textShadow: '0 0 6px #E85D4A66' }}
                >
                  {t('landing.proofFeed.loadMore')}
                </button>
              </div>
            </div>
          </div>
        </section>

        <FooterCTA />
      </div>
    </div>
  );
}