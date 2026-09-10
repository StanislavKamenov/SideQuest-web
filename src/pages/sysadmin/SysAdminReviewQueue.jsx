import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, X, AlertTriangle, MapPin, ExternalLink, 
  Search, Filter, Clock, Shield, ShieldAlert, FileWarning
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function SysAdminReviewQueue() {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  
  // Modals / Dialogs
  const [selectedProof, setSelectedProof] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null); // { id, type: 'approve' | 'reject' }

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
      // Calculate risk and sort
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
      }).sort((a, b) => b.riskScore - a.riskScore); // Highest risk first

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

  const RiskBadge = ({ level }) => {
    const colors = {
      Critical: 'bg-red-500/20 text-red-400 border-red-500/30',
      High: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      Low: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    };
    const icons = {
      Critical: <ShieldAlert size={14} className="mr-1.5" />,
      High: <AlertTriangle size={14} className="mr-1.5" />,
      Medium: <FileWarning size={14} className="mr-1.5" />,
      Low: <Shield size={14} className="mr-1.5" />,
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${colors[level]}`}>
        {icons[level]}
        {level}
      </span>
    );
  };

  if (loading) {
    return <div className="p-8 text-zinc-400">Loading queue...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Proof Review Queue</h1>
          <p className="text-zinc-400">Review flagged completions and anti-cheat escalations.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-4 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-white">{queue.length}</span>
            <span className="text-xs text-zinc-400 uppercase tracking-wider">Pending</span>
          </div>
          <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-4 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-red-400">
              {queue.filter(q => q.riskLevel === 'Critical').length}
            </span>
            <span className="text-xs text-zinc-400 uppercase tracking-wider">Critical</span>
          </div>
        </div>
      </div>

      {queue.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/30 border border-white/5 rounded-xl">
          <Shield className="mx-auto h-12 w-12 text-emerald-500/50 mb-4" />
          <h3 className="text-lg font-medium text-white">All caught up!</h3>
          <p className="text-zinc-400">The review queue is empty.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {queue.map(proof => (
            <motion.div
              key={proof.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors"
            >
              <div className="flex flex-col md:flex-row">
                {/* Image Thumbnail */}
                <div 
                  className="w-full md:w-48 h-48 bg-black/50 relative cursor-pointer group shrink-0"
                  onClick={() => setSelectedProof(proof)}
                >
                  {proof.ai_assessment?.frames?.length > 0 ? (
                    <div className="w-full h-full grid grid-cols-2 gap-0.5 opacity-80 group-hover:opacity-100 transition-opacity">
                      {proof.ai_assessment.frames.slice(0, 4).map((f, i) => (
                        <img key={i} src={f} className="w-full h-full object-cover" alt="Frame" />
                      ))}
                    </div>
                  ) : proof.proof_url ? (
                    <img src={proof.proof_url} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="Proof" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600">No Image</div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <ExternalLink className="text-white" />
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <RiskBadge level={proof.riskLevel} />
                        <span className="text-xs text-zinc-400 flex items-center">
                          <Clock size={12} className="mr-1" />
                          {proof.proof_submitted_at ? formatDistanceToNow(new Date(proof.proof_submitted_at), { addSuffix: true }) : 'Unknown time'}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-1">
                        {proof.missions?.title || 'Unknown Mission'}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <span>Submitted by</span>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white/5 rounded-full text-zinc-300">
                          {proof.profiles?.avatar_url && (
                            <img src={proof.profiles.avatar_url} className="w-4 h-4 rounded-full" alt="" />
                          )}
                          <span className="font-medium">{proof.profiles?.username || 'Unknown'}</span>
                          <span className={`text-xs ml-1 ${proof.profiles?.trust_score < 50 ? 'text-red-400' : 'text-emerald-400'}`}>
                            (TS: {proof.profiles?.trust_score ?? 50})
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setConfirmAction({ id: proof.id, type: 'reject' })}
                        disabled={processingId === proof.id}
                        className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg flex items-center font-medium transition-colors"
                      >
                        <X size={16} className="mr-2" />
                        Reject
                      </button>
                      <button
                        onClick={() => setConfirmAction({ id: proof.id, type: 'approve' })}
                        disabled={processingId === proof.id}
                        className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded-lg flex items-center font-medium transition-colors"
                      >
                        <Check size={16} className="mr-2" />
                        Approve
                      </button>
                    </div>
                  </div>

                  {/* Anti Cheat Summary */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/5">
                    <div className="bg-white/5 rounded px-3 py-2">
                      <span className="block text-xs text-zinc-500 uppercase">Decision Engine</span>
                      <span className="text-sm font-bold text-zinc-300 mt-1 block">
                        {proof.verification_decision ? proof.verification_decision.toUpperCase() : 'N/A'}
                      </span>
                    </div>
                    <div className="bg-white/5 rounded px-3 py-2">
                      <span className="block text-xs text-zinc-500 uppercase">Risk Score</span>
                      <span className={`text-sm font-bold mt-1 block ${proof.risk_score > 50 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {proof.risk_score ?? 'N/A'}
                      </span>
                    </div>
                    <div className="bg-white/5 rounded px-3 py-2 col-span-2">
                      <span className="block text-xs text-zinc-500 uppercase">Decision Reason</span>
                      <span className="text-sm text-zinc-300 mt-1 block truncate">
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
              className="bg-zinc-900 border border-white/10 rounded-xl p-6 max-w-md w-full shadow-2xl"
            >
              <h3 className="text-xl font-bold text-white mb-2">
                {confirmAction.type === 'approve' ? 'Approve Proof?' : 'Reject Proof?'}
              </h3>
              <p className="text-zinc-400 mb-6">
                {confirmAction.type === 'approve' 
                  ? 'This will award the user XP and coins, and update their trust score positively. An audit log will be created.' 
                  : 'This will fail the mission for the user, apply a trust score penalty, and create an audit log.'}
              </p>
              <div className="flex gap-3 justify-end">
                <button 
                  onClick={() => setConfirmAction(null)}
                  className="px-4 py-2 text-zinc-300 hover:text-white"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleReview(confirmAction.id, confirmAction.type)}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    confirmAction.type === 'approve' 
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                >
                  Confirm {confirmAction.type}
                </button>
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
              className="bg-zinc-900 border border-white/10 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl"
            >
              <div className="w-full md:w-1/2 bg-black flex items-center justify-center min-h-[300px] overflow-y-auto p-4">
                {selectedProof.ai_assessment?.frames?.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2 w-full">
                    {selectedProof.ai_assessment.frames.map((f, i) => (
                      <img key={i} src={f} className="w-full h-auto object-contain rounded border border-white/10" alt={`Frame ${i}`} />
                    ))}
                  </div>
                ) : selectedProof.proof_url ? (
                  <img src={selectedProof.proof_url} className="max-w-full max-h-[90vh] object-contain" alt="Full Proof" />
                ) : (
                  <div className="text-zinc-500">No media</div>
                )}
              </div>
              <div className="w-full md:w-1/2 p-6 overflow-y-auto">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-bold text-white">Submission Details</h3>
                  <button onClick={() => setSelectedProof(null)} className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-white/5">
                    <X size={20} />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-2">User Context</h4>
                    <div className="bg-white/5 p-4 rounded-lg">
                      <div className="text-white font-medium mb-1">{selectedProof.profiles?.full_name} (@{selectedProof.profiles?.username})</div>
                      <div className="text-sm text-zinc-400">Trust Score: <strong className={selectedProof.profiles?.trust_score < 50 ? 'text-red-400' : 'text-emerald-400'}>{selectedProof.profiles?.trust_score}</strong></div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-2">Decision Engine</h4>
                    <div className="bg-white/5 p-4 rounded-lg space-y-3">
                      <div>
                        <span className="text-xs text-zinc-500 uppercase">Decision</span>
                        <div className="text-white font-bold">{selectedProof.verification_decision?.toUpperCase() || 'N/A'}</div>
                      </div>
                      <div>
                        <span className="text-xs text-zinc-500 uppercase">Reason</span>
                        <div className="text-zinc-300 text-sm">{selectedProof.verification_reason || 'N/A'}</div>
                      </div>
                      <div className="flex gap-6">
                        <div>
                          <span className="text-xs text-zinc-500 uppercase">Risk Score</span>
                          <div className={`font-bold ${selectedProof.risk_score > 50 ? 'text-red-400' : 'text-emerald-400'}`}>
                            {selectedProof.risk_score ?? 'N/A'}
                          </div>
                        </div>
                        <div>
                          <span className="text-xs text-zinc-500 uppercase">AI Confidence</span>
                          <div className="text-white font-bold">
                            {selectedProof.ai_confidence ? `${Math.round(selectedProof.ai_confidence * 100)}%` : 'N/A'}
                          </div>
                        </div>
                      </div>
                      {selectedProof.ai_assessment?.video_consistency && (
                        <div>
                          <span className="text-xs text-zinc-500 uppercase">Video Consistency</span>
                          <div className="text-white font-bold">{selectedProof.ai_assessment.video_consistency.toUpperCase()}</div>
                        </div>
                      )}
                      {selectedProof.fraud_indicators?.length > 0 && (
                        <div>
                          <span className="text-xs text-zinc-500 uppercase">Fraud Indicators</span>
                          <ul className="list-disc pl-4 text-red-400 text-sm mt-1">
                            {selectedProof.fraud_indicators.map((ind, i) => (
                              <li key={i}>{ind}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-2">Technical Meta</h4>
                    <div className="bg-white/5 p-4 rounded-lg font-mono text-xs text-zinc-400 space-y-2">
                      <div className="flex break-all"><span className="text-zinc-500 w-24 shrink-0">ID:</span> {selectedProof.id}</div>
                      <div className="flex break-all"><span className="text-zinc-500 w-24 shrink-0">Hash:</span> {selectedProof.proof_hash || 'N/A'}</div>
                      <div className="flex"><span className="text-zinc-500 w-24 shrink-0">GPS:</span> {selectedProof.proof_lat}, {selectedProof.proof_lng}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-2">Anti-Cheat Flags</h4>
                    {selectedProof.flags?.length > 0 ? (
                      <div className="space-y-2">
                        {selectedProof.flags.map((f, i) => (
                          <div key={i} className="bg-red-500/10 border border-red-500/20 text-red-300 p-3 rounded-lg text-sm">
                            <span className="font-bold">{f.reason}</span>
                            {f.detail && <pre className="mt-2 text-xs opacity-80 overflow-x-auto">{JSON.stringify(f.detail, null, 2)}</pre>}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-zinc-400">No raw flags reported by the validator.</div>
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
