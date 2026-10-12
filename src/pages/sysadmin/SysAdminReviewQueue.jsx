import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, X, AlertTriangle, MapPin, ExternalLink, 
  Search, Filter, Clock, Shield, ShieldAlert, FileWarning,
  RefreshCw, Video, Image as ImageIcon
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useTranslation } from 'react-i18next';

export default function SysAdminReviewQueue() {
  const { t } = useTranslation();
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('pending_review'); // pending_review | completed | failed | all
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedProof, setSelectedProof] = useState(null);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      let { data, error } = await supabase
        .from('mission_participants')
        .select(`
          *,
          missions ( id, title, description, radius_m, xp_reward, coins_reward ),
          profiles!mission_participants_user_id_fkey ( id, username, display_name, avatar_url, trust_score )
        `)
        .in('status', ['pending_review', 'completed', 'failed'])
        .order('joined_at', { ascending: false });

      if (error) {
        console.warn('Primary foreign-key join failed, trying fallback select:', error);
        const fallback = await supabase
          .from('mission_participants')
          .select(`
            *,
            missions ( id, title, description ),
            profiles:user_id ( id, username, display_name, avatar_url, trust_score )
          `)
          .in('status', ['pending_review', 'completed', 'failed'])
          .order('joined_at', { ascending: false });

        if (!fallback.error && fallback.data) {
          data = fallback.data;
          error = null;
        }
      }

      if (error) {
        console.error('Error fetching review queue:', error);
      } else if (data) {
        const processed = data.map(proof => {
          const trust = proof.profiles?.trust_score ?? 50;
          const flags = proof.flags || [];
          const aiRec = proof.ai_assessment?.recommendation;
          
          let riskLevel = 'Low';
          let riskScore = 0;

          if (trust < 30) riskScore += 3;
          if (trust < 50) riskScore += 1;
          
          const hasHashMismatch = Array.isArray(flags) && flags.some(f => f.reason === 'duplicate_proof');
          const isOutOfRange = Array.isArray(flags) && flags.some(f => f.reason === 'out_of_range');
          
          if (hasHashMismatch) riskScore += 4;
          if (isOutOfRange) riskScore += 2;
          if (aiRec === 'reject') riskScore += 3;

          if (riskScore >= 5) riskLevel = 'Critical';
          else if (riskScore >= 3) riskLevel = 'High';
          else if (riskScore >= 1) riskLevel = 'Medium';

          return { ...proof, riskLevel, riskScore };
        }).sort((a, b) => {
          if (a.status === 'pending_review' && b.status !== 'pending_review') return -1;
          if (b.status === 'pending_review' && a.status !== 'pending_review') return 1;
          if (b.riskScore !== a.riskScore) return b.riskScore - a.riskScore;
          
          const timeA = new Date(a.proof_submitted_at || a.completed_at || a.joined_at || 0).getTime();
          const timeB = new Date(b.proof_submitted_at || b.completed_at || b.joined_at || 0).getTime();
          return timeB - timeA;
        });

        setQueue(processed);
      }
    } catch (err) {
      console.error('Unexpected error loading queue:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleManualRefresh = () => {
    setRefreshing(true);
    fetchQueue();
  };

  const handleReview = async (id, action) => {
    setProcessingId(id);
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;
    
    if (!token) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-review-proof`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ participant_id: id, action })
      });

      if (res.ok) {
        const newStatus = action === 'approve' ? 'completed' : 'failed';
        setQueue(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
        // Refresh quietly in background
        fetchQueue();
      } else {
        const err = await res.json();
        alert(`Error: ${err.error || 'Action failed'}`);
      }
    } catch (e) {
      alert('Failed to execute action');
    } finally {
      setProcessingId(null);
      setConfirmAction(null);
      setSelectedProof(null);
    }
  };

  const getProofMediaUrl = (proof) => {
    if (!proof) return null;
    if (proof.proof_url) return proof.proof_url;
    if (Array.isArray(proof.proof_urls) && proof.proof_urls.length > 0) {
      return proof.proof_urls[0];
    }
    if (typeof proof.proof_urls === 'string') {
      return proof.proof_urls;
    }
    return null;
  };

  const getAllProofMedia = (proof) => {
    if (!proof) return [];
    const list = [];
    if (Array.isArray(proof.proof_urls)) {
      list.push(...proof.proof_urls.filter(Boolean));
    } else if (typeof proof.proof_urls === 'string') {
      list.push(proof.proof_urls);
    }
    if (proof.proof_url && !list.includes(proof.proof_url)) {
      list.push(proof.proof_url);
    }
    return list;
  };

  const isVideoUrl = (url) => {
    if (!url || typeof url !== 'string') return false;
    const clean = url.split('?')[0].toLowerCase();
    return clean.endsWith('.mp4') || clean.endsWith('.mov') || clean.endsWith('.webm') || clean.endsWith('.m4v');
  };

  const riskColors = {
    Critical: { text: '#E85D4A', border: '#E85D4A', bg: '#E85D4A' },
    High: { text: '#E8956A', border: '#E8956A', bg: '#E8956A' },
    Medium: { text: '#C8E650', border: '#C8E650', bg: '#C8E650' },
    Low: { text: '#4EE6D0', border: '#4EE6D0', bg: '#4EE6D0' },
  };
  const riskIcons = {
    Critical: <ShieldAlert size={12} />,
    High: <AlertTriangle size={12} />,
    Medium: <FileWarning size={12} />,
    Low: <Shield size={12} />,
  };

  const RiskBadge = ({ level }) => {
    const c = riskColors[level] || riskColors.Low;
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 font-pixel text-[7px] tracking-widest border"
        style={{ color: c.text, borderColor: c.border + '44', backgroundColor: c.bg + '11', textShadow: `0 0 6px ${c.text}66` }}
      >
        {riskIcons[level]}
        {level.toUpperCase()}
      </span>
    );
  };

  const pendingCount = queue.filter(q => q.status === 'pending_review').length;
  const approvedCount = queue.filter(q => q.status === 'completed').length;
  const rejectedCount = queue.filter(q => q.status === 'failed').length;
  const allCount = queue.length;
  const criticalCount = queue.filter(q => q.riskLevel === 'Critical').length;

  const filteredQueue = queue.filter(item => {
    if (statusFilter !== 'all' && item.status !== statusFilter) {
      return false;
    }
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const username = item.profiles?.username?.toLowerCase() || '';
    const displayName = item.profiles?.display_name?.toLowerCase() || '';
    const title = item.missions?.title?.toLowerCase() || '';
    return username.includes(q) || displayName.includes(q) || title.includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-[#A663E0]" />
          <div>
            <h1 className="font-pixel text-xl text-foreground tracking-tight" style={{ textShadow: '0 0 10px rgba(166, 99, 224, 0.5)' }}>
              {t("sysadmin.reviewQueue.title") || "PROOF REVIEW QUEUE"}
            </h1>
            <p className="font-body text-sm text-muted-foreground mt-1">
              {t("sysadmin.reviewQueue.subtitle") || "Review flagged completions, photos, videos, and GPS locations."}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="bg-card border border-[#A663E0]/30 p-4 flex flex-col items-center justify-center min-w-[90px]">
            <span className="font-pixel text-2xl text-[#A663E0]" style={{ textShadow: '0 0 10px #A663E066' }}>
              {pendingCount}
            </span>
            <span className="font-pixel text-[6px] text-muted-foreground tracking-widest mt-1">
              {t("sysadmin.reviewQueue.pending") || "PENDING"}
            </span>
          </div>
          <div className="bg-card border border-[#C8E650]/30 p-4 flex flex-col items-center justify-center min-w-[90px]">
            <span className="font-pixel text-2xl text-[#C8E650]" style={{ textShadow: '0 0 10px #C8E65066' }}>
              {approvedCount}
            </span>
            <span className="font-pixel text-[6px] text-muted-foreground tracking-widest mt-1">
              {t("sysadmin.reviewQueue.approved") || "APPROVED"}
            </span>
          </div>
          <div className="bg-card border border-[#E85D4A]/30 p-4 flex flex-col items-center justify-center min-w-[90px]">
            <span className="font-pixel text-2xl text-[#E85D4A]" style={{ textShadow: '0 0 10px #E85D4A66' }}>
              {criticalCount}
            </span>
            <span className="font-pixel text-[6px] text-[#E85D4A]/70 tracking-widest mt-1">
              {t("sysadmin.reviewQueue.critical") || "CRITICAL"}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-3">
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { id: 'pending_review', label: t("sysadmin.reviewQueue.pendingTab") || 'PENDING REVIEW', count: pendingCount, color: '#A663E0' },
            { id: 'completed', label: t("sysadmin.reviewQueue.approvedTab") || 'APPROVED', count: approvedCount, color: '#C8E650' },
            { id: 'failed', label: t("sysadmin.reviewQueue.rejectedTab") || 'REJECTED', count: rejectedCount, color: '#E85D4A' },
            { id: 'all', label: t("sysadmin.reviewQueue.allTab") || 'ALL PROOFS', count: allCount, color: '#4EE6D0' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-2 font-pixel text-[8px] tracking-wider border transition-all flex items-center gap-2 ${
                statusFilter === tab.id
                  ? 'bg-secondary border-border shadow-[0_0_10px_rgba(166,99,224,0.2)]'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
              style={statusFilter === tab.id ? { borderColor: tab.color, color: tab.color } : {}}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.5 rounded text-[7px] ${statusFilter === tab.id ? 'bg-white/10 text-white' : 'bg-secondary text-muted-foreground'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder={t("sysadmin.reviewQueue.search") || "Search player or mission..."}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-card border border-border pl-9 pr-3 py-1.5 font-body text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-[#A663E0] focus:outline-none transition-colors w-48 md:w-64"
            />
          </div>
          <button
            onClick={handleManualRefresh}
            disabled={refreshing || loading}
            className="p-2 border border-border bg-card hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            title="Refresh Queue"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin text-[#A663E0]" : ""} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#A663E0]/30 border-t-[#A663E0] rounded-full animate-spin" />
        </div>
      ) : filteredQueue.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border">
          <Shield className="mx-auto h-10 w-10 text-[#C8E650]/50 mb-4" />
          <h3 className="font-pixel text-[11px] text-foreground tracking-wider mb-1">
            {t("sysadmin.reviewQueue.allCaughtUp") || "NO PROOFS FOUND"}
          </h3>
          <p className="font-body text-sm text-muted-foreground">
            {searchQuery 
              ? (t("sysadmin.reviewQueue.noSearchMatch") || "No submissions matched your search query.")
              : statusFilter === 'pending_review' 
                ? (t("sysadmin.reviewQueue.noProofsPending") || "The pending review queue is empty. No submissions awaiting approval.") 
                : statusFilter === 'completed'
                  ? (t("sysadmin.reviewQueue.noProofsApproved") || "No approved proofs found.")
                  : statusFilter === 'failed'
                    ? (t("sysadmin.reviewQueue.noProofsRejected") || "No rejected proofs found.")
                    : (t("sysadmin.reviewQueue.noProofsAll") || "No proof submissions found.")}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredQueue.map((proof, i) => {
            const mediaUrl = getProofMediaUrl(proof);
            const isVideo = isVideoUrl(mediaUrl);

            return (
              <motion.div
                key={proof.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-card border-2 border-border overflow-hidden hover:border-[#A663E0]/40 transition-all"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Media Thumbnail */}
                  <div 
                    className="w-full md:w-52 h-48 bg-black/60 relative cursor-pointer group shrink-0 overflow-hidden flex items-center justify-center border-b md:border-b-0 md:border-r border-border"
                    onClick={() => {
                      setSelectedProof(proof);
                      setSelectedMediaIndex(0);
                    }}
                  >
                    {proof.ai_assessment?.frames?.length > 0 ? (
                      <div className="w-full h-full grid grid-cols-2 gap-0.5 opacity-80 group-hover:opacity-100 transition-opacity">
                        {proof.ai_assessment.frames.slice(0, 4).map((f, fi) => (
                          <img key={fi} src={f} className="w-full h-full object-cover" alt="Frame" />
                        ))}
                      </div>
                    ) : mediaUrl ? (
                      isVideo ? (
                        <div className="w-full h-full relative">
                          <video 
                            src={mediaUrl} 
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                            muted 
                            playsInline 
                            preload="metadata"
                          />
                          <div className="absolute top-2 left-2 bg-black/80 border border-white/20 px-1.5 py-0.5 font-pixel text-[6px] text-white flex items-center gap-1 z-10">
                            <Video size={10} className="text-[#4EE6D0]" /> VIDEO
                          </div>
                        </div>
                      ) : (
                        <img 
                          src={mediaUrl} 
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                          alt="Proof" 
                          loading="lazy"
                        />
                      )
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center">
                        <ImageIcon size={24} className="text-muted-foreground/40 mb-1" />
                        <span className="font-pixel text-[8px] text-muted-foreground tracking-wider">NO MEDIA</span>
                      </div>
                    )}

                    {/* CRT scanline overlay */}
                    <div className="absolute inset-0 pointer-events-none"
                      style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 6px)' }}
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity z-20">
                      <ExternalLink className="text-white w-5 h-5" />
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <RiskBadge level={proof.riskLevel} />
                          <span className="font-pixel text-[6px] text-muted-foreground flex items-center tracking-wider">
                            <Clock size={10} className="mr-1" />
                            {proof.proof_submitted_at 
                              ? formatDistanceToNow(new Date(proof.proof_submitted_at), { addSuffix: true }) 
                              : (proof.completed_at ? formatDistanceToNow(new Date(proof.completed_at), { addSuffix: true }) : 'Unknown')}
                          </span>

                          {proof.status === 'pending_review' && (
                            <span className="px-1.5 py-0.5 bg-[#A663E0]/10 border border-[#A663E0]/40 text-[#A663E0] font-pixel text-[6px] tracking-wider">
                              {t("sysadmin.reviewQueue.pendingTab") || "PENDING REVIEW"}
                            </span>
                          )}
                          {proof.status === 'completed' && (
                            <span className="px-1.5 py-0.5 bg-[#C8E650]/10 border border-[#C8E650]/40 text-[#C8E650] font-pixel text-[6px] tracking-wider">
                              {t("sysadmin.reviewQueue.approvedTab") || "APPROVED"}
                            </span>
                          )}
                          {proof.status === 'failed' && (
                            <span className="px-1.5 py-0.5 bg-[#E85D4A]/10 border border-[#E85D4A]/40 text-[#E85D4A] font-pixel text-[6px] tracking-wider">
                              {t("sysadmin.reviewQueue.rejectedTab") || "REJECTED"}
                            </span>
                          )}
                        </div>

                        <h3 className="font-pixel text-[11px] text-foreground mb-1 tracking-wide">
                          {proof.missions?.title || 'Unknown Mission'}
                        </h3>

                        <div className="flex items-center gap-2 font-pixel text-[7px] text-muted-foreground tracking-wider flex-wrap mt-2">
                          <span>{t("sysadmin.reviewQueue.submittedBy") || "Submitted by"}</span>
                          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-secondary/30 border border-border text-foreground">
                            {proof.profiles?.avatar_url && (
                              <img src={proof.profiles.avatar_url} className="w-4 h-4 rounded-full object-cover" alt="" />
                            )}
                            <span>{proof.profiles?.display_name || proof.profiles?.username || 'Unknown'}</span>
                            <span className={(proof.profiles?.trust_score ?? 50) < 50 ? 'text-[#E85D4A]' : 'text-[#C8E650]'}
                              style={{ textShadow: (proof.profiles?.trust_score ?? 50) < 50 ? '0 0 6px #E85D4A66' : '0 0 6px #C8E65066' }}
                            >
                              (TS: {proof.profiles?.trust_score ?? 50})
                            </span>
                          </div>

                          {/* GPS Location badge */}
                          {proof.proof_lat != null && proof.proof_lng != null && (
                            <a
                              href={`https://www.google.com/maps?q=${proof.proof_lat},${proof.proof_lng}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#4EE6D0]/10 border border-[#4EE6D0]/40 text-[#4EE6D0] hover:bg-[#4EE6D0]/20 transition-colors"
                              title="Open GPS in Google Maps"
                            >
                              <MapPin size={10} />
                              <span>{Number(proof.proof_lat).toFixed(4)}, {Number(proof.proof_lng).toFixed(4)}</span>
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 shrink-0">
                        {proof.status === 'pending_review' ? (
                          <>
                            <button
                              onClick={() => setConfirmAction({ id: proof.id, type: 'reject' })}
                              disabled={processingId === proof.id}
                              className="px-3 py-2 bg-[#E85D4A]/10 border border-[#E85D4A]/40 text-[#E85D4A] hover:bg-[#E85D4A]/20 font-pixel text-[7px] tracking-wider flex items-center gap-1.5 transition-all disabled:opacity-50"
                            >
                              <X size={14} />
                              {t("sysadmin.reviewQueue.reject") || "REJECT"}
                            </button>
                            <button
                              onClick={() => setConfirmAction({ id: proof.id, type: 'approve' })}
                              disabled={processingId === proof.id}
                              className="px-3 py-2 bg-[#C8E650]/10 border border-[#C8E650]/40 text-[#C8E650] hover:bg-[#C8E650]/20 font-pixel text-[7px] tracking-wider flex items-center gap-1.5 transition-all disabled:opacity-50"
                            >
                              <Check size={14} />
                              {t("sysadmin.reviewQueue.approve") || "APPROVE"}
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedProof(proof);
                              setSelectedMediaIndex(0);
                            }}
                            className="px-3 py-2 bg-secondary border border-border text-foreground hover:bg-secondary/80 font-pixel text-[7px] tracking-wider flex items-center gap-1.5 transition-all"
                          >
                            <ExternalLink size={12} />
                            VIEW DETAILS
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Anti Cheat Summary */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-border/50">
                      <div className="bg-secondary/20 border border-border px-3 py-2">
                        <span className="block font-pixel text-[6px] text-muted-foreground tracking-widest">DECISION ENGINE</span>
                        <span className="font-pixel text-[8px] text-foreground mt-1 block tracking-wide">
                          {proof.verification_decision ? proof.verification_decision.toUpperCase() : 'N/A'}
                        </span>
                      </div>
                      <div className="bg-secondary/20 border border-border px-3 py-2">
                        <span className="block font-pixel text-[6px] text-muted-foreground tracking-widest">RISK SCORE</span>
                        <span className={`font-pixel text-[8px] mt-1 block ${proof.risk_score > 50 ? 'text-[#E85D4A]' : 'text-[#C8E650]'}`}
                          style={{ textShadow: proof.risk_score > 50 ? '0 0 6px #E85D4A66' : '0 0 6px #C8E65066' }}
                        >
                          {proof.risk_score ?? 'N/A'}
                        </span>
                      </div>
                      <div className="bg-secondary/20 border border-border px-3 py-2 col-span-2">
                        <span className="block font-pixel text-[6px] text-muted-foreground tracking-widest">DECISION REASON</span>
                        <span className="font-body text-xs text-muted-foreground mt-1 block truncate">
                          {proof.verification_reason || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmAction && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="crt-card border-2 border-border p-6 max-w-md w-full"
              style={{ boxShadow: confirmAction.type === 'approve' ? '0 0 40px rgba(200,230,80,0.15)' : '0 0 40px rgba(232,93,74,0.15)' }}
            >
              <div className="relative z-10">
                <h3 className="font-pixel text-[11px] text-foreground mb-2 tracking-wider"
                  style={{ textShadow: confirmAction.type === 'approve' ? '0 0 8px #C8E65066' : '0 0 8px #E85D4A66' }}
                >
                  {confirmAction.type === 'approve' 
                    ? (t("sysadmin.reviewQueue.confirmApprove") || 'APPROVE PROOF?')
                    : (t("sysadmin.reviewQueue.confirmReject") || 'REJECT PROOF?')}
                </h3>
                <p className="font-body text-sm text-muted-foreground mb-6">
                  {confirmAction.type === 'approve' 
                    ? (t("sysadmin.reviewQueue.approveDesc") || 'This will award the user XP and coins, and update their trust score positively. An audit log will be created.')
                    : (t("sysadmin.reviewQueue.rejectDesc") || 'This will fail the mission for the user, apply a trust score penalty, and create an audit log.')}
                </p>
                <div className="flex gap-3 justify-end">
                  <button 
                    onClick={() => setConfirmAction(null)}
                    className="px-4 py-2 font-pixel text-[8px] text-muted-foreground hover:text-foreground tracking-wider transition-colors"
                  >
                    {t("sysadmin.reviewQueue.cancel") || "CANCEL"}
                  </button>
                  <button 
                    onClick={() => handleReview(confirmAction.id, confirmAction.type)}
                    className={`px-4 py-2 font-pixel text-[8px] tracking-wider transition-all arcade-btn ${
                      confirmAction.type === 'approve' 
                        ? 'bg-[#C8E650] text-black hover:bg-[#b8d640]' 
                        : 'bg-[#E85D4A] text-white hover:bg-[#d44d3a]'
                    }`}
                    style={{ boxShadow: confirmAction.type === 'approve' ? '0 3px 0 0 #8aa530' : '0 3px 0 0 #9d3324' }}
                  >
                    {t("sysadmin.reviewQueue.confirm") || "CONFIRM"} {confirmAction.type.toUpperCase()}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Full Details Modal */}
      <AnimatePresence>
        {selectedProof && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="crt-card border-2 border-border max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row"
              style={{ boxShadow: '0 0 60px rgba(166,99,224,0.15)' }}
            >
              {/* Left Column: Full Media Viewer */}
              <div className="w-full md:w-1/2 bg-black/80 flex flex-col items-center justify-center min-h-[340px] max-h-[85vh] overflow-y-auto p-4 relative border-b md:border-b-0 md:border-r border-border">
                {selectedProof.ai_assessment?.frames?.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2 w-full">
                    {selectedProof.ai_assessment.frames.map((f, fi) => (
                      <img key={fi} src={f} className="w-full h-auto object-contain border border-border" alt={`Frame ${fi}`} />
                    ))}
                  </div>
                ) : (() => {
                  const allMedia = getAllProofMedia(selectedProof);
                  const activeUrl = allMedia[selectedMediaIndex] || allMedia[0];
                  
                  if (!activeUrl) {
                    return (
                      <div className="text-center p-8">
                        <ImageIcon size={40} className="mx-auto text-muted-foreground/30 mb-2" />
                        <div className="font-pixel text-[9px] text-muted-foreground tracking-wider">NO MEDIA AVAILABLE</div>
                      </div>
                    );
                  }

                  const activeIsVideo = isVideoUrl(activeUrl);

                  return (
                    <div className="w-full flex flex-col items-center gap-3">
                      {activeIsVideo ? (
                        <video 
                          src={activeUrl} 
                          controls 
                          autoPlay 
                          className="max-w-full max-h-[60vh] object-contain border border-border rounded"
                        />
                      ) : (
                        <img 
                          src={activeUrl} 
                          className="max-w-full max-h-[60vh] object-contain border border-border rounded" 
                          alt="Full Proof" 
                        />
                      )}

                      {allMedia.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto w-full py-2 justify-center">
                          {allMedia.map((url, idx) => (
                            <button
                              key={idx}
                              onClick={() => setSelectedMediaIndex(idx)}
                              className={`w-14 h-14 shrink-0 border-2 overflow-hidden ${selectedMediaIndex === idx ? 'border-[#A663E0]' : 'border-border opacity-60 hover:opacity-100'}`}
                            >
                              {isVideoUrl(url) ? (
                                <div className="w-full h-full bg-black/80 flex items-center justify-center text-[10px]">🎥</div>
                              ) : (
                                <img src={url} className="w-full h-full object-cover" alt="" />
                              )}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Direct External Link */}
                      <a 
                        href={activeUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-pixel text-[7px] text-[#4EE6D0] hover:underline"
                      >
                        <ExternalLink size={10} /> OPEN ORIGINAL FILE IN NEW TAB
                      </a>
                    </div>
                  );
                })()}

                {/* CRT Scanline */}
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 6px)' }}
                />
              </div>

              {/* Right Column: Submission Details */}
              <div className="w-full md:w-1/2 p-6 overflow-y-auto relative z-10 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="font-pixel text-[12px] text-foreground tracking-wider" style={{ textShadow: '0 0 8px #A663E066' }}>
                        {t("sysadmin.reviewQueue.submissionDetails") || "SUBMISSION DETAILS"}
                      </h3>
                      <p className="font-body text-xs text-muted-foreground mt-0.5">
                        {selectedProof.missions?.title}
                      </p>
                    </div>
                    <button onClick={() => setSelectedProof(null)} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                      <X size={18} />
                    </button>
                  </div>
                  
                  <div className="space-y-5">
                    {/* User Context */}
                    <div>
                      <h4 className="font-pixel text-[7px] text-muted-foreground tracking-widest mb-2">USER CONTEXT</h4>
                      <div className="bg-secondary/20 border border-border p-4">
                        <div className="font-pixel text-[9px] text-foreground mb-1 tracking-wide">
                          {selectedProof.profiles?.display_name || selectedProof.profiles?.username} (@{selectedProof.profiles?.username})
                        </div>
                        <div className="font-pixel text-[7px] text-muted-foreground tracking-wider">
                          Trust Score: <strong className={(selectedProof.profiles?.trust_score ?? 50) < 50 ? 'text-[#E85D4A]' : 'text-[#C8E650]'}
                            style={{ textShadow: (selectedProof.profiles?.trust_score ?? 50) < 50 ? '0 0 6px #E85D4A66' : '0 0 6px #C8E65066' }}
                          >{selectedProof.profiles?.trust_score ?? 50}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Decision Engine */}
                    <div>
                      <h4 className="font-pixel text-[7px] text-muted-foreground tracking-widest mb-2">DECISION ENGINE</h4>
                      <div className="bg-secondary/20 border border-border p-4 space-y-3">
                        <div>
                          <span className="font-pixel text-[6px] text-muted-foreground tracking-widest">DECISION</span>
                          <div className="font-pixel text-[9px] text-foreground tracking-wide">{selectedProof.verification_decision?.toUpperCase() || 'N/A'}</div>
                        </div>
                        <div>
                          <span className="font-pixel text-[6px] text-muted-foreground tracking-widest">REASON</span>
                          <div className="font-body text-xs text-muted-foreground">{selectedProof.verification_reason || 'N/A'}</div>
                        </div>
                        <div className="flex gap-6">
                          <div>
                            <span className="font-pixel text-[6px] text-muted-foreground tracking-widest">RISK SCORE</span>
                            <div className={`font-pixel text-[10px] ${selectedProof.risk_score > 50 ? 'text-[#E85D4A]' : 'text-[#C8E650]'}`}>
                              {selectedProof.risk_score ?? 'N/A'}
                            </div>
                          </div>
                          <div>
                            <span className="font-pixel text-[6px] text-muted-foreground tracking-widest">AI CONFIDENCE</span>
                            <div className="font-pixel text-[10px] text-foreground">
                              {selectedProof.ai_confidence ? `${Math.round(selectedProof.ai_confidence * 100)}%` : 'N/A'}
                            </div>
                          </div>
                        </div>
                        {selectedProof.ai_assessment?.video_consistency && (
                          <div>
                            <span className="font-pixel text-[6px] text-muted-foreground tracking-widest">VIDEO CONSISTENCY</span>
                            <div className="font-pixel text-[9px] text-foreground">{selectedProof.ai_assessment.video_consistency.toUpperCase()}</div>
                          </div>
                        )}
                        {selectedProof.fraud_indicators?.length > 0 && (
                          <div>
                            <span className="font-pixel text-[6px] text-muted-foreground tracking-widest">FRAUD INDICATORS</span>
                            <ul className="list-disc pl-4 text-[#E85D4A] font-body text-xs mt-1">
                              {selectedProof.fraud_indicators.map((ind, fi) => (
                                <li key={fi}>{ind}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Technical Metadata including GPS Coordinates */}
                    <div>
                      <h4 className="font-pixel text-[7px] text-muted-foreground tracking-widest mb-2">TECHNICAL & GPS META</h4>
                      <div className="bg-secondary/20 border border-border p-4 font-mono text-[10px] text-muted-foreground space-y-2.5">
                        <div className="flex break-all">
                          <span className="text-muted-foreground/50 w-20 shrink-0 font-pixel text-[6px] tracking-widest">ID:</span>
                          <span className="text-foreground">{selectedProof.id}</span>
                        </div>
                        <div className="flex break-all">
                          <span className="text-muted-foreground/50 w-20 shrink-0 font-pixel text-[6px] tracking-widest">HASH:</span>
                          <span>{selectedProof.proof_hash || 'N/A'}</span>
                        </div>
                        <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-border/40">
                          <div className="flex items-center">
                            <span className="text-muted-foreground/50 w-20 shrink-0 font-pixel text-[6px] tracking-widest">GPS:</span>
                            {selectedProof.proof_lat != null && selectedProof.proof_lng != null ? (
                              <span className="text-[#4EE6D0] font-pixel text-[8px]">
                                {Number(selectedProof.proof_lat).toFixed(6)}, {Number(selectedProof.proof_lng).toFixed(6)}
                              </span>
                            ) : (
                              <span className="text-muted-foreground/60 italic">No GPS coordinates recorded</span>
                            )}
                          </div>
                          {selectedProof.proof_lat != null && selectedProof.proof_lng != null && (
                            <a
                              href={`https://www.google.com/maps?q=${selectedProof.proof_lat},${selectedProof.proof_lng}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 font-pixel text-[7px] bg-[#4EE6D0]/10 border border-[#4EE6D0]/40 text-[#4EE6D0] hover:bg-[#4EE6D0]/20 px-2 py-1 transition-colors"
                            >
                              <MapPin size={10} />
                              OPEN IN GOOGLE MAPS
                            </a>
                          )}
                        </div>
                        {selectedProof.proof_submitted_at && (
                          <div className="flex">
                            <span className="text-muted-foreground/50 w-20 shrink-0 font-pixel text-[6px] tracking-widest">SUBMITTED:</span>
                            <span>{new Date(selectedProof.proof_submitted_at).toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Anti-cheat flags */}
                    <div>
                      <h4 className="font-pixel text-[7px] text-muted-foreground tracking-widest mb-2">ANTI-CHEAT FLAGS</h4>
                      {selectedProof.flags?.length > 0 ? (
                        <div className="space-y-2">
                          {selectedProof.flags.map((f, fi) => (
                            <div key={fi} className="bg-[#E85D4A]/10 border border-[#E85D4A]/30 text-[#E85D4A] p-3">
                              <span className="font-pixel text-[8px] tracking-wider">{f.reason}</span>
                              {f.detail && <pre className="mt-2 font-mono text-[10px] opacity-80 overflow-x-auto">{JSON.stringify(f.detail, null, 2)}</pre>}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="font-body text-sm text-muted-foreground">No raw flags reported by the validator.</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Modal Footer Actions */}
                {selectedProof.status === 'pending_review' && (
                  <div className="pt-6 mt-6 border-t border-border flex justify-end gap-3">
                    <button
                      onClick={() => setConfirmAction({ id: selectedProof.id, type: 'reject' })}
                      disabled={processingId === selectedProof.id}
                      className="px-4 py-2.5 bg-[#E85D4A]/10 border border-[#E85D4A]/40 text-[#E85D4A] hover:bg-[#E85D4A]/20 font-pixel text-[8px] tracking-wider flex items-center gap-2 transition-all disabled:opacity-50"
                    >
                      <X size={14} />
                      {t("sysadmin.reviewQueue.reject") || "REJECT PROOF"}
                    </button>
                    <button
                      onClick={() => setConfirmAction({ id: selectedProof.id, type: 'approve' })}
                      disabled={processingId === selectedProof.id}
                      className="px-4 py-2.5 bg-[#C8E650]/10 border border-[#C8E650]/40 text-[#C8E650] hover:bg-[#C8E650]/20 font-pixel text-[8px] tracking-wider flex items-center gap-2 transition-all disabled:opacity-50"
                    >
                      <Check size={14} />
                      {t("sysadmin.reviewQueue.approve") || "APPROVE PROOF"}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
