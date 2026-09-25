import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, X, AlertTriangle, MapPin, ExternalLink, 
  Search, Filter, Clock, Shield, ShieldAlert, FileWarning
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useTranslation } from 'react-i18next';

export default function SysAdminReviewQueue() {
  const { t } = useTranslation();
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  
  const [selectedProof, setSelectedProof] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('mission_participants')
      .select(`
        *,
        missions ( id, title, description ),
        profiles ( id, username, full_name, avatar_url, trust_score )
      `)
      .eq('status', 'pending_review')
      .order('proof_submitted_at', { ascending: false });

    if (!error && data) {
      const processed = data.map(proof => {
        const trust = proof.profiles?.trust_score ?? 50;
        const flags = proof.flags || [];
        const aiRec = proof.ai_assessment?.recommendation;
        
        let riskLevel = 'Low';
        let riskScore = 0;

        if (trust < 30) riskScore += 3;
        if (trust < 50) riskScore += 1;
        
        const hasHashMismatch = flags.some(f => f.reason === 'duplicate_proof');
        const isOutOfRange = flags.some(f => f.reason === 'out_of_range');
        
        if (hasHashMismatch) riskScore += 4;
        if (isOutOfRange) riskScore += 2;
        if (aiRec === 'reject') riskScore += 3;

        if (riskScore >= 5) riskLevel = 'Critical';
        else if (riskScore >= 3) riskLevel = 'High';
        else if (riskScore >= 1) riskLevel = 'Medium';

        return { ...proof, riskLevel, riskScore };
      }).sort((a, b) => b.riskScore - a.riskScore);

      setQueue(processed);
    }
    setLoading(false);
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
        setQueue(prev => prev.filter(p => p.id !== id));
      } else {
        const err = await res.json();
        alert(`Error: ${err.error}`);
      }
    } catch (e) {
      alert('Failed to execute action');
    } finally {
      setProcessingId(null);
      setConfirmAction(null);
      setSelectedProof(null);
    }
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
    const c = riskColors[level];
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 font-pixel text-[7px] tracking-widest border"
        style={{ color: c.text, borderColor: c.border + '44', backgroundColor: c.bg + '11', textShadow: `0 0 6px ${c.text}66` }}
      >
        {riskIcons[level]}
        {level.toUpperCase()}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-[#A663E0]/30 border-t-[#A663E0] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-[#A663E0]" />
          <div>
            <h1 className="font-pixel text-xl text-foreground tracking-tight" style={{ textShadow: '0 0 10px rgba(166, 99, 224, 0.5)' }}>
              {t("sysadmin.reviewQueue.title") || "PROOF REVIEW QUEUE"}
            </h1>
            <p className="font-body text-sm text-muted-foreground mt-1">
              {t("sysadmin.reviewQueue.subtitle") || "Review flagged completions and anti-cheat escalations."}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="bg-card border border-border p-4 flex flex-col items-center justify-center">
            <span className="font-pixel text-2xl text-foreground">{queue.length}</span>
            <span className="font-pixel text-[6px] text-muted-foreground tracking-widest mt-1">
              {t("sysadmin.reviewQueue.pending") || "PENDING"}
            </span>
          </div>
          <div className="bg-card border border-[#E85D4A]/30 p-4 flex flex-col items-center justify-center">
            <span className="font-pixel text-2xl text-[#E85D4A]" style={{ textShadow: '0 0 10px #E85D4A66' }}>
              {queue.filter(q => q.riskLevel === 'Critical').length}
            </span>
            <span className="font-pixel text-[6px] text-[#E85D4A]/70 tracking-widest mt-1">
              {t("sysadmin.reviewQueue.critical") || "CRITICAL"}
            </span>
          </div>
        </div>
      </div>

      {queue.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border">
          <Shield className="mx-auto h-10 w-10 text-[#C8E650]/50 mb-4" />
          <h3 className="font-pixel text-[11px] text-foreground tracking-wider mb-1">
            {t("sysadmin.reviewQueue.allCaughtUp") || "ALL CAUGHT UP!"}
          </h3>
          <p className="font-body text-sm text-muted-foreground">
            {t("sysadmin.reviewQueue.emptyQueue") || "The review queue is empty."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {queue.map((proof, i) => (
            <motion.div
              key={proof.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-card border-2 border-border overflow-hidden hover:border-[#A663E0]/30 transition-all"
            >
              <div className="flex flex-col md:flex-row">
                {/* Image Thumbnail */}
                <div 
                  className="w-full md:w-48 h-48 bg-black/50 relative cursor-pointer group shrink-0"
                  onClick={() => setSelectedProof(proof)}
                >
                  {proof.ai_assessment?.frames?.length > 0 ? (
                    <div className="w-full h-full grid grid-cols-2 gap-0.5 opacity-80 group-hover:opacity-100 transition-opacity">
                      {proof.ai_assessment.frames.slice(0, 4).map((f, fi) => (
                        <img key={fi} src={f} className="w-full h-full object-cover" alt="Frame" />
                      ))}
                    </div>
                  ) : proof.proof_url ? (
                    <img src={proof.proof_url} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="Proof" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-pixel text-[8px] text-muted-foreground tracking-wider">NO IMAGE</div>
                  )}
                  {/* CRT scanline overlay */}
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 6px)' }}
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <ExternalLink className="text-white w-5 h-5" />
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <RiskBadge level={proof.riskLevel} />
                        <span className="font-pixel text-[6px] text-muted-foreground flex items-center tracking-wider">
                          <Clock size={10} className="mr-1" />
                          {proof.proof_submitted_at ? formatDistanceToNow(new Date(proof.proof_submitted_at), { addSuffix: true }) : 'Unknown'}
                        </span>
                      </div>
                      <h3 className="font-pixel text-[11px] text-foreground mb-1 tracking-wide">
                        {proof.missions?.title || 'Unknown Mission'}
                      </h3>
                      <div className="flex items-center gap-2 font-pixel text-[7px] text-muted-foreground tracking-wider">
                        <span>{t("sysadmin.reviewQueue.submittedBy") || "Submitted by"}</span>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-secondary/30 border border-border text-foreground">
                          {proof.profiles?.avatar_url && (
                            <img src={proof.profiles.avatar_url} className="w-4 h-4" alt="" />
                          )}
                          <span>{proof.profiles?.username || 'Unknown'}</span>
                          <span className={proof.profiles?.trust_score < 50 ? 'text-[#E85D4A]' : 'text-[#C8E650]'}
                            style={{ textShadow: proof.profiles?.trust_score < 50 ? '0 0 6px #E85D4A66' : '0 0 6px #C8E65066' }}
                          >
                            (TS: {proof.profiles?.trust_score ?? 50})
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setConfirmAction({ id: proof.id, type: 'reject' })}
                        disabled={processingId === proof.id}
                        className="px-3 py-2 bg-[#E85D4A]/10 border border-[#E85D4A]/40 text-[#E85D4A] hover:bg-[#E85D4A]/20 font-pixel text-[7px] tracking-wider flex items-center gap-1.5 transition-all"
                      >
                        <X size={14} />
                        {t("sysadmin.reviewQueue.reject") || "REJECT"}
                      </button>
                      <button
                        onClick={() => setConfirmAction({ id: proof.id, type: 'approve' })}
                        disabled={processingId === proof.id}
                        className="px-3 py-2 bg-[#C8E650]/10 border border-[#C8E650]/40 text-[#C8E650] hover:bg-[#C8E650]/20 font-pixel text-[7px] tracking-wider flex items-center gap-1.5 transition-all"
                      >
                        <Check size={14} />
                        {t("sysadmin.reviewQueue.approve") || "APPROVE"}
                      </button>
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
          ))}
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
              <div className="w-full md:w-1/2 bg-black/50 flex items-center justify-center min-h-[300px] overflow-y-auto p-4 relative">
                {selectedProof.ai_assessment?.frames?.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2 w-full">
                    {selectedProof.ai_assessment.frames.map((f, fi) => (
                      <img key={fi} src={f} className="w-full h-auto object-contain border border-border" alt={`Frame ${fi}`} />
                    ))}
                  </div>
                ) : selectedProof.proof_url ? (
                  <img src={selectedProof.proof_url} className="max-w-full max-h-[90vh] object-contain" alt="Full Proof" />
                ) : (
                  <div className="font-pixel text-[9px] text-muted-foreground tracking-wider">NO MEDIA</div>
                )}
                {/* Scanline */}
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 6px)' }}
                />
              </div>
              <div className="w-full md:w-1/2 p-6 overflow-y-auto relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="font-pixel text-[12px] text-foreground tracking-wider" style={{ textShadow: '0 0 8px #A663E066' }}>
                    {t("sysadmin.reviewQueue.submissionDetails") || "SUBMISSION DETAILS"}
                  </h3>
                  <button onClick={() => setSelectedProof(null)} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                    <X size={18} />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-pixel text-[7px] text-muted-foreground tracking-widest mb-2">USER CONTEXT</h4>
                    <div className="bg-secondary/20 border border-border p-4">
                      <div className="font-pixel text-[9px] text-foreground mb-1 tracking-wide">{selectedProof.profiles?.full_name} (@{selectedProof.profiles?.username})</div>
                      <div className="font-pixel text-[7px] text-muted-foreground tracking-wider">
                        Trust Score: <strong className={selectedProof.profiles?.trust_score < 50 ? 'text-[#E85D4A]' : 'text-[#C8E650]'}
                          style={{ textShadow: selectedProof.profiles?.trust_score < 50 ? '0 0 6px #E85D4A66' : '0 0 6px #C8E65066' }}
                        >{selectedProof.profiles?.trust_score}</strong>
                      </div>
                    </div>
                  </div>

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

                  <div>
                    <h4 className="font-pixel text-[7px] text-muted-foreground tracking-widest mb-2">TECHNICAL META</h4>
                    <div className="bg-secondary/20 border border-border p-4 font-mono text-[10px] text-muted-foreground space-y-2">
                      <div className="flex break-all"><span className="text-muted-foreground/50 w-20 shrink-0 font-pixel text-[6px] tracking-widest">ID:</span> {selectedProof.id}</div>
                      <div className="flex break-all"><span className="text-muted-foreground/50 w-20 shrink-0 font-pixel text-[6px] tracking-widest">HASH:</span> {selectedProof.proof_hash || 'N/A'}</div>
                      <div className="flex"><span className="text-muted-foreground/50 w-20 shrink-0 font-pixel text-[6px] tracking-widest">GPS:</span> {selectedProof.proof_lat}, {selectedProof.proof_lng}</div>
                    </div>
                  </div>

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
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
