import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, DollarSign, CreditCard, ArrowUpRight, Clock, CheckCircle, XCircle, RotateCcw, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/lib/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const statusConfig = {
  completed: { label: 'COMPLETED', color: '#C8E650', icon: CheckCircle },
  pending: { label: 'PENDING', color: '#E8956A', icon: Clock },
  failed: { label: 'FAILED', color: '#E85D4A', icon: XCircle },
  refunded: { label: 'REFUNDED', color: '#6B9FD4', icon: RotateCcw },
};

export default function AdminPayments() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error: fnError } = await supabase.functions.invoke('list-payments', {
          method: 'POST',
        });

        if (fnError) throw fnError;
        if (data?.error) throw new Error(data.error);

        setPayments(data?.data || []);
      } catch (err) {
        console.error("Error fetching payments:", err);
        setError(err.message || "Failed to load payments");
        toast({
          title: "Error Loading Payments",
          description: err.message || "Could not fetch payment history.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchPayments();
    }
  }, [user]);

  const filtered = payments.filter((p) => {
    const matchesFilter = filter === 'all' || p.status === filter;
    const matchesSearch =
      (p.customer || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.invoice || '').toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalReceived = payments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);
    
  const totalPending = payments
    .filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);
    
  // Format current month as YYYY-MM
  const currentMonthStr = new Date().toISOString().slice(0, 7);
  const thisMonth = payments
    .filter((p) => p.date.startsWith(currentMonthStr) && p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-[#E85D4A]/30 border-t-[#E85D4A] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 bg-card border border-border">
        <h2 className="font-pixel text-[12px] text-red-400 tracking-widest">ERROR LOADING PAYMENTS</h2>
        <p className="font-body text-sm text-muted-foreground/60 mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-pixel text-[clamp(0.7rem,2vw,1rem)] text-foreground glow-red mb-2 leading-relaxed">
          PAYMENTS & INVOICES
        </h1>
        <p className="font-body text-sm text-muted-foreground">
          Track your payments and invoices to SideQuest
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 flex items-center justify-center border-2 border-[#C8E650]/40 bg-[#C8E650]/10">
              <DollarSign className="w-4 h-4 text-[#C8E650]" />
            </div>
            <span className="font-pixel text-[7px] text-muted-foreground tracking-widest">LIFETIME SPENT</span>
          </div>
          <p className="font-pixel text-[clamp(1rem,2.5vw,1.5rem)] text-[#C8E650]" style={{ textShadow: '0 0 12px #C8E65044' }}>
            ${totalReceived.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 flex items-center justify-center border-2 border-[#E8956A]/40 bg-[#E8956A]/10">
              <Clock className="w-4 h-4 text-[#E8956A]" />
            </div>
            <span className="font-pixel text-[7px] text-muted-foreground tracking-widest">PENDING</span>
          </div>
          <p className="font-pixel text-[clamp(1rem,2.5vw,1.5rem)] text-[#E8956A]" style={{ textShadow: '0 0 12px #E8956A44' }}>
            ${totalPending.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 flex items-center justify-center border-2 border-[#6B9FD4]/40 bg-[#6B9FD4]/10">
              <ArrowUpRight className="w-4 h-4 text-[#6B9FD4]" />
            </div>
            <span className="font-pixel text-[7px] text-muted-foreground tracking-widest">SPENT THIS MONTH</span>
          </div>
          <p className="font-pixel text-[clamp(1rem,2.5vw,1.5rem)] text-[#6B9FD4]" style={{ textShadow: '0 0 12px #6B9FD444' }}>
            ${thisMonth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </motion.div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by customer or invoice..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card border border-border pl-10 pr-4 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-[#E85D4A] focus:outline-none transition-colors"
          />
        </div>
        <div className="flex items-center gap-1 bg-card border border-border p-1">
          {['all', 'completed', 'pending', 'failed', 'refunded'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 font-pixel text-[7px] tracking-wider transition-all ${
                filter === s
                  ? 'bg-[#E85D4A]/20 text-[#E85D4A]'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {s.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border overflow-hidden">
        <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 border-b border-border bg-secondary/30">
          <span className="col-span-2 font-pixel text-[6px] text-muted-foreground tracking-widest">INVOICE</span>
          <span className="col-span-2 font-pixel text-[6px] text-muted-foreground tracking-widest">CUSTOMER</span>
          <span className="col-span-2 font-pixel text-[6px] text-muted-foreground tracking-widest">AMOUNT</span>
          <span className="col-span-2 font-pixel text-[6px] text-muted-foreground tracking-widest">DATE</span>
          <span className="col-span-2 font-pixel text-[6px] text-muted-foreground tracking-widest">STATUS</span>
          <span className="col-span-2 font-pixel text-[6px] text-muted-foreground tracking-widest text-right">ACTION</span>
        </div>

        {filtered.map((p, i) => {
          const sc = statusConfig[p.status] || statusConfig.failed;
          const StatusIcon = sc.icon;
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-5 py-4 border-b border-border/50 hover:bg-secondary/20 transition-colors items-center"
            >
              <div className="col-span-2">
                <span className="font-pixel text-[8px] text-[#6B9FD4] tracking-wide">{p.invoice}</span>
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <CreditCard className="w-3 h-3 text-muted-foreground hidden md:block" />
                <span className="font-body text-sm text-foreground truncate" title={p.customer}>{p.customer}</span>
              </div>
              <div className="col-span-2">
                <span className="font-pixel text-[10px] text-foreground">${p.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="col-span-2">
                <span className="font-body text-xs text-muted-foreground">{p.date}</span>
              </div>
              <div className="col-span-2">
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 font-pixel text-[6px] tracking-wider"
                  style={{ color: sc.color, backgroundColor: sc.color + '15', border: `1px solid ${sc.color}44` }}
                >
                  <StatusIcon className="w-2.5 h-2.5" />
                  {sc.label}
                </span>
              </div>
              <div className="col-span-2 flex justify-end">
                {p.hosted_invoice_url && (
                  <a 
                    href={p.hosted_invoice_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1 border border-border bg-secondary/10 hover:bg-secondary/30 transition-colors font-pixel text-[6px] tracking-wider text-muted-foreground hover:text-foreground"
                  >
                    <ExternalLink className="w-2.5 h-2.5" />
                    VIEW INVOICE
                  </a>
                )}
              </div>
            </motion.div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="font-pixel text-[9px] text-muted-foreground tracking-wider">NO PAYMENTS FOUND</p>
          </div>
        )}
      </div>
    </div>
  );
}
