import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { Search, Loader2, Database, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function SysAdminAuditLog() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [expandedRow, setExpandedRow] = useState(null);

  const { data: logs, isLoading } = useQuery({
    queryKey: ['sysadmin-audit-logs', search],
    queryFn: async () => {
      let q = supabase
        .from('admin_audit_logs')
        .select(`
          *,
          admin:profiles!admin_id ( username, full_name, avatar_url )
        `)
        .order('created_at', { ascending: false })
        .limit(100);
        
      if (search) {
        q = q.or(`action.ilike.%${search}%,target_type.ilike.%${search}%,target_id.ilike.%${search}%`);
      }
      
      const { data, error } = await q;
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-[#A663E0]" />
          <div>
            <h1 className="font-pixel text-xl text-foreground tracking-tight" style={{ textShadow: '0 0 10px rgba(166, 99, 224, 0.5)' }}>
              {t("sysadmin.auditLog.title")}
            </h1>
            <p className="font-body text-sm text-muted-foreground mt-1">{t("sysadmin.auditLog.subtitle")}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder={t("sysadmin.auditLog.search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-card border-2 border-border pl-10 pr-4 py-3 font-pixel text-[9px] text-foreground placeholder:text-muted-foreground/40 focus:border-[#A663E0] focus:outline-none transition-colors tracking-wider"
          style={{ boxShadow: 'inset 0 0 8px rgba(0,0,0,0.3)' }}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-[#A663E0]/30 border-t-[#A663E0] rounded-full animate-spin" />
        </div>
      ) : logs?.length === 0 ? (
        <div className="bg-card border border-border p-12 text-center">
          <Database className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="font-pixel text-[11px] text-foreground tracking-wider mb-1">{t("sysadmin.auditLog.noLogs")}</h3>
          <p className="font-body text-sm text-muted-foreground">{t("sysadmin.auditLog.noLogsDesc")}</p>
        </div>
      ) : (
        <div className="bg-card border-2 border-border overflow-hidden">
          {/* Table header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 border-b border-border bg-secondary/30">
            <span className="col-span-3 font-pixel text-[6px] text-muted-foreground tracking-widest">{t("sysadmin.auditLog.table.timestamp")}</span>
            <span className="col-span-2 font-pixel text-[6px] text-muted-foreground tracking-widest">{t("sysadmin.auditLog.table.admin")}</span>
            <span className="col-span-2 font-pixel text-[6px] text-muted-foreground tracking-widest">{t("sysadmin.auditLog.table.action")}</span>
            <span className="col-span-2 font-pixel text-[6px] text-muted-foreground tracking-widest">{t("sysadmin.auditLog.table.targetType")}</span>
            <span className="col-span-2 font-pixel text-[6px] text-muted-foreground tracking-widest">{t("sysadmin.auditLog.table.targetId")}</span>
            <span className="col-span-1 font-pixel text-[6px] text-muted-foreground tracking-widest text-right">{t("sysadmin.auditLog.table.details")}</span>
          </div>

          {/* Rows */}
          <div className="divide-y divide-border/50">
            {logs?.map((log, i) => (
              <React.Fragment key={log.id}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-5 py-4 hover:bg-secondary/20 transition-colors items-center cursor-pointer"
                  onClick={() => setExpandedRow(expandedRow === log.id ? null : log.id)}
                >
                  <div className="col-span-3">
                    <div className="flex items-center font-pixel text-[7px] text-muted-foreground tracking-wider">
                      <Clock size={10} className="mr-1.5 text-muted-foreground/50" />
                      {format(new Date(log.created_at), 'MMM d, yyyy HH:mm:ss')}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center gap-2 font-pixel text-[8px] text-foreground tracking-wide">
                      {log.admin?.avatar_url ? (
                        <img src={log.admin.avatar_url} alt="" className="w-5 h-5 border border-border" />
                      ) : (
                        <div className="w-5 h-5 bg-secondary border border-border flex items-center justify-center font-pixel text-[6px] text-muted-foreground">
                          {(log.admin?.username || '?')[0]?.toUpperCase()}
                        </div>
                      )}
                      {log.admin?.username || t("sysadmin.auditLog.unknown")}
                    </div>
                  </div>
                  <div className="col-span-2 whitespace-nowrap">
                    <span className={`px-2 py-1 font-pixel text-[7px] tracking-wider border ${
                      log.action.includes('approve') ? 'text-[#C8E650] border-[#C8E650]/30 bg-[#C8E650]/10' : 
                      log.action.includes('reject') || log.action.includes('ban') ? 'text-[#E85D4A] border-[#E85D4A]/30 bg-[#E85D4A]/10' : 
                      'text-[#6B9FD4] border-[#6B9FD4]/30 bg-[#6B9FD4]/10'
                    }`}>
                      {log.action}
                    </span>
                  </div>
                  <div className="col-span-2 whitespace-nowrap font-pixel text-[8px] text-muted-foreground capitalize tracking-wide">
                    {log.target_type}
                  </div>
                  <div className="col-span-2 font-mono text-[10px] text-muted-foreground truncate max-w-[150px]">
                    {log.target_id}
                  </div>
                  <div className="col-span-1 text-right">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setExpandedRow(expandedRow === log.id ? null : log.id); }}
                      className="p-1 text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors inline-flex"
                    >
                      {expandedRow === log.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>
                </motion.div>
                
                {/* Expandable Metadata */}
                <AnimatePresence>
                  {expandedRow === log.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-[#0a0912]"
                    >
                      <div className="px-6 py-4 border-t border-border/30">
                        <h4 className="font-pixel text-[7px] text-muted-foreground tracking-widest mb-2">{t("sysadmin.auditLog.metadata")}</h4>
                        <pre className="bg-black/50 border border-border p-4 font-mono text-[11px] text-muted-foreground overflow-x-auto"
                          style={{ boxShadow: 'inset 0 0 12px rgba(0,0,0,0.4)' }}
                        >
                          {JSON.stringify(log.metadata, null, 2)}
                        </pre>
                        <div className="mt-4 font-pixel text-[6px] text-muted-foreground/50 tracking-widest">
                          {t("sysadmin.auditLog.logId")} {log.id}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
