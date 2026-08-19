import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, X, AlertCircle, AlertTriangle, MessageSquare, User as UserIcon, ShieldAlert,
  Search, Filter, Trash2, Clock, AlertOctagon, CheckCircle2
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function SysAdminReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [filter, setFilter] = useState('pending'); // pending, resolved, dismissed

  // Modals
  const [selectedReport, setSelectedReport] = useState(null);
  const [actionModal, setActionModal] = useState(null); // { report, type: 'resolve' | 'dismiss' }

  useEffect(() => {
    fetchReports();
  }, [filter]);

  const fetchReports = async () => {
    setLoading(true);
    
    // We join the reporter profile.
    const { data, error } = await supabase
      .from('content_reports')
      .select(`
        *,
        reporter:profiles!reporter_id ( id, username, full_name, avatar_url, trust_score ),
        resolver:profiles!resolved_by ( id, username )
      `)
      .eq('status', filter)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setReports(data);
    }
    setLoading(false);
  };

  const handleAction = async (reportId, status, actionTaken = 'none') => {
    setProcessingId(reportId);
    
    try {
      const { data, error } = await supabase.rpc('sysadmin_resolve_report', {
        p_report_id: reportId,
        p_status: status,
        p_action_taken: actionTaken
      });

      if (error) {
        alert(`Error: ${error.message}`);
      } else {
        setReports(prev => prev.filter(r => r.id !== reportId));
      }
    } catch (e) {
      alert('Failed to execute action');
    } finally {
      setProcessingId(null);
      setActionModal(null);
      setSelectedReport(null);
    }
  };

  const TypeIcon = ({ type }) => {
    if (type === 'post') return <AlertOctagon size={16} className="text-blue-400" />;
    if (type === 'comment') return <MessageSquare size={16} className="text-purple-400" />;
    return <UserIcon size={16} className="text-orange-400" />;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Content Moderation</h1>
          <p className="text-zinc-400">Review user reports for posts, comments, and other users.</p>
        </div>
        <div className="mt-4 md:mt-0 flex bg-zinc-900 border border-white/10 rounded-lg p-1">
          {['pending', 'resolved', 'dismissed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === f 
                  ? 'bg-white/10 text-white' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-zinc-400">Loading reports...</div>
      ) : reports.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/30 border border-white/5 rounded-xl">
          <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500/50 mb-4" />
          <h3 className="text-lg font-medium text-white">No {filter} reports</h3>
          <p className="text-zinc-400">You're all caught up here.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {reports.map(report => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-900 border border-white/10 rounded-xl p-5 hover:border-white/20 transition-colors flex flex-col md:flex-row justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-zinc-300 capitalize">
                    <TypeIcon type={report.content_type} />
                    {report.content_type}
                  </span>
                  <span className="text-xs text-zinc-400 flex items-center">
                    <Clock size={12} className="mr-1" />
                    {formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-white mb-1">
                  "{report.reason}"
                </h3>
                
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <span>Reported by</span>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white/5 rounded-full text-zinc-300">
                    {report.reporter?.avatar_url && (
                      <img src={report.reporter.avatar_url} className="w-4 h-4 rounded-full" alt="" />
                    )}
                    <span className="font-medium">{report.reporter?.username || 'Unknown'}</span>
                    <span className={`text-xs ml-1 ${report.reporter?.trust_score < 50 ? 'text-red-400' : 'text-emerald-400'}`}>
                      (TS: {report.reporter?.trust_score ?? 50})
                    </span>
                  </div>
                </div>
              </div>

              {filter === 'pending' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActionModal({ report, type: 'dismiss' })}
                    disabled={processingId === report.id}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg font-medium transition-colors"
                  >
                    Dismiss
                  </button>
                  <button
                    onClick={() => setActionModal({ report, type: 'resolve' })}
                    disabled={processingId === report.id}
                    className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg flex items-center font-medium transition-colors"
                  >
                    <ShieldAlert size={16} className="mr-2" />
                    Take Action
                  </button>
                </div>
              )}
              
              {filter !== 'pending' && (
                <div className="flex flex-col items-end justify-center text-sm">
                  <span className={`font-medium ${filter === 'resolved' ? 'text-emerald-400' : 'text-zinc-500'}`}>
                    {filter.toUpperCase()}
                  </span>
                  {report.resolver && (
                    <span className="text-zinc-500 text-xs mt-1">by {report.resolver.username}</span>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Action Modal */}
      <AnimatePresence>
        {actionModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-900 border border-white/10 rounded-xl p-6 max-w-md w-full shadow-2xl"
            >
              <h3 className="text-xl font-bold text-white mb-2">
                {actionModal.type === 'resolve' ? 'Resolve Report' : 'Dismiss Report'}
              </h3>
              
              {actionModal.type === 'resolve' ? (
                <>
                  <p className="text-zinc-400 mb-6">
                    What action do you want to take against this {actionModal.report.content_type}?
                  </p>
                  <div className="space-y-3 mb-6">
                    <button 
                      onClick={() => handleAction(actionModal.report.id, 'resolved', 'remove_content')}
                      className="w-full flex items-center justify-center gap-2 p-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} /> Delete {actionModal.report.content_type}
                    </button>
                    <button 
                      onClick={() => handleAction(actionModal.report.id, 'resolved', 'warn_user')}
                      className="w-full flex items-center justify-center gap-2 p-3 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-lg transition-colors"
                    >
                      <AlertTriangle size={16} /> Mark Resolved (No Deletion)
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-zinc-400 mb-6">
                  Are you sure you want to dismiss this report? The reporter will not be notified, and no action will be taken.
                </p>
              )}
              
              <div className="flex gap-3 justify-end mt-4 pt-4 border-t border-white/5">
                <button 
                  onClick={() => setActionModal(null)}
                  className="px-4 py-2 text-zinc-300 hover:text-white"
                >
                  Cancel
                </button>
                {actionModal.type === 'dismiss' && (
                  <button 
                    onClick={() => handleAction(actionModal.report.id, 'dismissed')}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium"
                  >
                    Confirm Dismiss
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
