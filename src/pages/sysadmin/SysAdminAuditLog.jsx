import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { Search, Loader2, Database, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

export default function SysAdminAuditLog() {
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
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Audit Logs</h1>
          <p className="text-zinc-400">Immutable record of all administrative actions taken on the platform.</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Search by action, target type, or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-zinc-900 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:border-emerald-500 focus:outline-none transition-colors"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        </div>
      ) : logs?.length === 0 ? (
        <div className="bg-zinc-900/50 border border-white/5 p-12 text-center text-zinc-400 rounded-xl">
          <Database className="mx-auto h-12 w-12 text-zinc-700 mb-4" />
          <h3 className="text-lg font-medium text-white">No logs found</h3>
          <p className="text-zinc-500">No administrative actions match your search.</p>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-400">
              <thead className="bg-white/5 text-xs uppercase text-zinc-300 font-medium">
                <tr>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">Admin</th>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Target Type</th>
                  <th className="px-6 py-4">Target ID</th>
                  <th className="px-6 py-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {logs?.map((log) => (
                  <React.Fragment key={log.id}>
                    <tr className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-zinc-300">
                          <Clock size={12} className="mr-1.5 text-zinc-500" />
                          {format(new Date(log.created_at), 'MMM d, yyyy HH:mm:ss')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-white font-medium">
                          {log.admin?.avatar_url ? (
                            <img src={log.admin.avatar_url} alt="" className="w-5 h-5 rounded-full" />
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-zinc-800" />
                          )}
                          {log.admin?.username || 'Unknown'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-xs font-medium bg-white/5 border border-white/10 ${
                          log.action.includes('approve') ? 'text-emerald-400' : 
                          log.action.includes('reject') || log.action.includes('ban') ? 'text-red-400' : 
                          'text-blue-400'
                        }`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap capitalize text-zinc-300">
                        {log.target_type}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs truncate max-w-[150px]">
                        {log.target_id}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => setExpandedRow(expandedRow === log.id ? null : log.id)}
                          className="p-1 text-zinc-500 hover:text-white rounded hover:bg-white/10 transition-colors inline-flex"
                        >
                          {expandedRow === log.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </td>
                    </tr>
                    
                    {/* Expandable Metadata Row */}
                    <AnimatePresence>
                      {expandedRow === log.id && (
                        <tr>
                          <td colSpan={6} className="px-0 py-0 border-0">
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="bg-black/30 overflow-hidden"
                            >
                              <div className="px-6 py-4">
                                <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Metadata Snapshot</h4>
                                <pre className="bg-black border border-white/5 rounded-lg p-4 font-mono text-xs text-zinc-300 overflow-x-auto">
                                  {JSON.stringify(log.metadata, null, 2)}
                                </pre>
                                <div className="mt-4 text-xs text-zinc-500 font-mono">
                                  Log ID: {log.id}
                                </div>
                              </div>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
