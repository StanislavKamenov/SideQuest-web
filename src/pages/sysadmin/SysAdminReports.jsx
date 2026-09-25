import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, X, AlertCircle, AlertTriangle, MessageSquare, User as UserIcon, ShieldAlert,
  Search, Filter, Trash2, Clock, AlertOctagon, CheckCircle2
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useTranslation } from 'react-i18next';

export default function SysAdminReports() {
  const { t, i18n } = useTranslation();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [filter, setFilter] = useState('pending');

  // Modals
  const [selectedReport, setSelectedReport] = useState(null);
  const [actionModal, setActionModal] = useState(null);

  useEffect(() => {
    fetchReports();
  }, [filter]);

  const fetchReports = async () => {
    setLoading(true);
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
        alert(t("sysadmin.reports.toast.error", { message: error.message }));
      } else {
        setReports(prev => prev.filter(r => r.id !== reportId));
      }
    } catch (e) {
      alert(t("sysadmin.reports.toast.actionFailed"));
    } finally {
      setProcessingId(null);
      setActionModal(null);
      setSelectedReport(null);
    }
  };

  const TypeIcon = ({ type }) => {
    if (type === 'post') return <AlertOctagon size={14} className="text-[#6B9FD4]" />;
    if (type === 'comment') return <MessageSquare size={14} className="text-[#A663E0]" />;
    return <UserIcon size={14} className="text-[#E8956A]" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-[#A663E0]" />
          <div>
            <h1 className="font-pixel text-xl text-foreground tracking-tight" style={{ textShadow: '0 0 10px rgba(166, 99, 224, 0.5)' }}>
              {t("sysadmin.reports.title")}
            </h1>
            <p className="font-body text-sm text-muted-foreground mt-1">{t("sysadmin.reports.subtitle")}</p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1 bg-card border border-border p-1">
          {['pending', 'resolved', 'dismissed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 font-pixel text-[8px] tracking-wider transition-all ${
                filter === f 
                  ? 'bg-[#A663E0]/20 text-[#A663E0]' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t(`sysadmin.reports.filter.${f}`)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#A663E0]/30 border-t-[#A663E0] rounded-full animate-spin" />
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border">
          <CheckCircle2 className="mx-auto h-10 w-10 text-[#C8E650]/50 mb-4" />
          <h3 className="font-pixel text-[11px] text-foreground tracking-wider mb-1">{t("sysadmin.reports.noReports", { filter: t(`sysadmin.reports.filter.${filter}`).toLowerCase() })}</h3>
          <p className="font-body text-sm text-muted-foreground">{t("sysadmin.reports.caughtUp")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((report, i) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-card border-2 border-border p-5 hover:border-[#A663E0]/30 transition-all flex flex-col md:flex-row justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-secondary/30 border border-border font-pixel text-[7px] text-muted-foreground tracking-wider capitalize">
                    <TypeIcon type={report.content_type} />
                    {report.content_type}
                  </span>
                  <span className="font-pixel text-[6px] text-muted-foreground flex items-center tracking-wider">
                    <Clock size={10} className="mr-1" />
                    {formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}
                  </span>
                </div>
                
                <h3 className="font-pixel text-[10px] text-foreground mb-2 tracking-wide">
                  "{report.reason}"
                </h3>
                
                <div className="flex items-center gap-2 font-pixel text-[7px] text-muted-foreground tracking-wider">
                  <span>{t("sysadmin.reports.reportedBy")}</span>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-secondary/30 border border-border text-foreground">
                    {report.reporter?.avatar_url && (
                      <img src={report.reporter.avatar_url} className="w-4 h-4" alt="" />
                    )}
                    <span>{report.reporter?.username || t("sysadmin.reports.unknown")}</span>
                    <span className={`${report.reporter?.trust_score < 50 ? 'text-[#E85D4A]' : 'text-[#C8E650]'}`}
                      style={{ textShadow: report.reporter?.trust_score < 50 ? '0 0 6px #E85D4A66' : '0 0 6px #C8E65066' }}
                    >
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
                    className="px-3 py-2 bg-secondary/30 border border-border text-muted-foreground hover:text-foreground hover:border-[#6B9FD4]/50 font-pixel text-[7px] tracking-wider transition-all"
                  >
                    {t("sysadmin.reports.dismissBtn")}
                  </button>
                  <button
                    onClick={() => setActionModal({ report, type: 'resolve' })}
                    disabled={processingId === report.id}
                    className="px-3 py-2 bg-[#E85D4A]/10 border border-[#E85D4A]/40 text-[#E85D4A] hover:bg-[#E85D4A]/20 font-pixel text-[7px] tracking-wider flex items-center gap-1.5 transition-all"
                  >
                    <ShieldAlert size={14} />
                    {t("sysadmin.reports.actionBtn")}
                  </button>
                </div>
              )}
              
              {filter !== 'pending' && (
                <div className="flex flex-col items-end justify-center">
                  <span className={`font-pixel text-[8px] tracking-widest ${filter === 'resolved' ? 'text-[#C8E650]' : 'text-muted-foreground'}`}
                    style={filter === 'resolved' ? { textShadow: '0 0 6px #C8E65066' } : {}}
                  >
                    {t(`sysadmin.reports.filter.${filter}`).toUpperCase()}
                  </span>
                  {report.resolver && (
                    <span className="font-pixel text-[6px] text-muted-foreground mt-1 tracking-wider">{t("sysadmin.reports.byResolver", { username: report.resolver.username })}</span>
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
              className="crt-card border-2 border-border p-6 max-w-md w-full"
              style={{ boxShadow: '0 0 40px rgba(232,93,74,0.15)' }}
            >
              <div className="relative z-10">
                <h3 className="font-pixel text-[11px] text-foreground mb-2 tracking-wider" style={{ textShadow: '0 0 8px #A663E066' }}>
                  {actionModal.type === 'resolve' ? t("sysadmin.reports.modal.resolveTitle") : t("sysadmin.reports.modal.dismissTitle")}
                </h3>
                
                {actionModal.type === 'resolve' ? (
                  <>
                    <p className="font-body text-sm text-muted-foreground mb-6">
                      {t("sysadmin.reports.modal.resolveDesc", { type: actionModal.report.content_type })}
                    </p>
                    <div className="space-y-3 mb-6">
                      <button 
                        onClick={() => handleAction(actionModal.report.id, 'resolved', 'remove_content')}
                        className="w-full flex items-center justify-center gap-2 p-3 bg-[#E85D4A]/10 border border-[#E85D4A]/40 text-[#E85D4A] hover:bg-[#E85D4A]/20 font-pixel text-[8px] tracking-wider transition-all"
                      >
                        <Trash2 size={14} /> {t("sysadmin.reports.modal.deleteBtn", { type: actionModal.report.content_type })}
                      </button>
                      <button 
                        onClick={() => handleAction(actionModal.report.id, 'resolved', 'warn_user')}
                        className="w-full flex items-center justify-center gap-2 p-3 bg-[#E8956A]/10 border border-[#E8956A]/40 text-[#E8956A] hover:bg-[#E8956A]/20 font-pixel text-[8px] tracking-wider transition-all"
                      >
                        <AlertTriangle size={14} /> {t("sysadmin.reports.modal.markResolvedBtn")}
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="font-body text-sm text-muted-foreground mb-6">
                    {t("sysadmin.reports.modal.dismissDesc")}
                  </p>
                )}
                
                <div className="flex gap-3 justify-end mt-4 pt-4 border-t border-border">
                  <button 
                    onClick={() => setActionModal(null)}
                    className="px-4 py-2 font-pixel text-[8px] text-muted-foreground hover:text-foreground tracking-wider transition-colors"
                  >
                    {t("sysadmin.reports.modal.cancel")}
                  </button>
                  {actionModal.type === 'dismiss' && (
                    <button 
                      onClick={() => handleAction(actionModal.report.id, 'dismissed')}
                      className="px-4 py-2 bg-secondary/50 border border-border text-foreground font-pixel text-[8px] tracking-wider hover:bg-secondary transition-all arcade-btn"
                    >
                      {t("sysadmin.reports.modal.confirmDismiss")}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
