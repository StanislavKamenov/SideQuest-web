import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Building2, Check, X, Search, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function SysAdminBusinesses() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('pending_review');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: businesses, isLoading } = useQuery({
    queryKey: ['sysadmin-businesses', filter],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('status', filter)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }) => {
      const { data, error } = await supabase.rpc('admin_set_business_status', {
        p_business_id: id,
        p_status: status
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['sysadmin-businesses']);
      toast({ title: t("sysadmin.businesses.toast.updated"), className: 'bg-[#C8E650] text-black font-pixel' });
    },
    onError: (err) => {
      toast({ title: t("sysadmin.businesses.toast.updateFailed"), description: err.message, variant: 'destructive', className: 'font-pixel' });
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-[#A663E0]" />
          <h1 className="font-pixel text-xl text-foreground tracking-tight">
            {t("sysadmin.businesses.title")}
          </h1>
        </div>
      </div>

      <div className="flex gap-4 border-b border-border">
        {['pending_review', 'approved', 'rejected', 'suspended'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`pb-3 font-pixel text-[10px] tracking-widest uppercase transition-colors ${
              filter === status 
                ? 'text-[#A663E0] border-b-2 border-[#A663E0]' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t(`sysadmin.businesses.filter.${status}`)}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#A663E0]" />
        </div>
      ) : businesses?.length === 0 ? (
        <div className="bg-card border border-border p-12 text-center text-muted-foreground font-pixel text-[10px]">
          {t("sysadmin.businesses.noBusinesses")}
        </div>
      ) : (
        <div className="space-y-4">
          {businesses?.map(business => (
            <div key={business.id} className="bg-card border border-border p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary/50 border border-border flex items-center justify-center">
                  {business.logo_url ? (
                    <img src={business.logo_url} alt={business.name} className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <h3 className="font-pixel text-sm text-foreground">{business.name}</h3>
                  <p className="font-body text-xs text-muted-foreground mt-1">
                    {business.category || t("sysadmin.businesses.uncategorized")} • {business.city || t("sysadmin.businesses.noLocation")}
                  </p>
                  <p className="font-body text-[10px] text-muted-foreground/70 mt-0.5">
                    {t("sysadmin.businesses.vat")} {business.vat_number || t("sysadmin.businesses.na")} • {t("sysadmin.businesses.contact")} {business.contact_email}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {filter === 'pending_review' && (
                  <>
                    <button
                      onClick={() => updateStatus.mutate({ id: business.id, status: 'approved' })}
                      disabled={updateStatus.isPending}
                      className="flex items-center gap-2 px-3 py-2 bg-[#C8E650]/10 border border-[#C8E650]/50 text-[#C8E650] hover:bg-[#C8E650]/20 font-pixel text-[8px] transition-colors"
                    >
                      <Check className="w-3 h-3" /> {t("sysadmin.businesses.approveBtn")}
                    </button>
                    <button
                      onClick={() => updateStatus.mutate({ id: business.id, status: 'rejected' })}
                      disabled={updateStatus.isPending}
                      className="flex items-center gap-2 px-3 py-2 bg-[#E85D4A]/10 border border-[#E85D4A]/50 text-[#E85D4A] hover:bg-[#E85D4A]/20 font-pixel text-[8px] transition-colors"
                    >
                      <X className="w-3 h-3" /> {t("sysadmin.businesses.rejectBtn")}
                    </button>
                  </>
                )}
                
                {filter === 'approved' && (
                  <button
                    onClick={() => updateStatus.mutate({ id: business.id, status: 'suspended' })}
                    disabled={updateStatus.isPending}
                    className="flex items-center gap-2 px-3 py-2 bg-[#E85D4A]/10 border border-[#E85D4A]/50 text-[#E85D4A] hover:bg-[#E85D4A]/20 font-pixel text-[8px] transition-colors"
                  >
                    {t("sysadmin.businesses.suspendBtn")}
                  </button>
                )}
                
                {(filter === 'suspended' || filter === 'rejected') && (
                  <button
                    onClick={() => updateStatus.mutate({ id: business.id, status: 'approved' })}
                    disabled={updateStatus.isPending}
                    className="flex items-center gap-2 px-3 py-2 bg-[#C8E650]/10 border border-[#C8E650]/50 text-[#C8E650] hover:bg-[#C8E650]/20 font-pixel text-[8px] transition-colors"
                  >
                    {t("sysadmin.businesses.reinstateBtn")}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
