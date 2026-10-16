import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Inbox, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const STATUSES = ['new', 'contacted', 'approved', 'rejected'];

/** Partner applications sent from the public website form (`business_leads`). */
export default function SysAdminLeads() {
  const { i18n } = useTranslation();
  const bg = i18n.language?.startsWith('bg');
  const L = (b, e) => (bg ? b : e);
  const [filter, setFilter] = useState('new');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const labels = {
    new: L('НОВИ', 'NEW'),
    contacted: L('СВЪРЗАНИ', 'CONTACTED'),
    approved: L('ОДОБРЕНИ', 'APPROVED'),
    rejected: L('ОТХВЪРЛЕНИ', 'REJECTED'),
  };

  const { data: leads, isLoading } = useQuery({
    queryKey: ['sysadmin-leads', filter],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business_leads')
        .select('*')
        .eq('status', filter)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const setStatus = useMutation({
    mutationFn: async ({ id, status }) => {
      const { error } = await supabase.from('business_leads').update({ status }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sysadmin-leads'] }),
    onError: (err) => toast({ title: L('Неуспешна промяна', 'Update failed'), description: err.message, variant: 'destructive', className: 'font-pixel' }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-2 h-8 bg-[#A663E0]" />
        <h1 className="font-pixel text-xl text-foreground tracking-tight">{L('ЗАЯВКИ ОТ САЙТА', 'WEBSITE APPLICATIONS')}</h1>
      </div>

      <div className="flex gap-4 border-b border-border">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`pb-3 font-pixel text-[8px] tracking-wider transition-colors ${filter === s ? 'text-[#A663E0] border-b-2 border-[#A663E0]' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {labels[s]}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-[#A663E0]" /></div>
      ) : !leads?.length ? (
        <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
          <Inbox className="w-8 h-8" aria-hidden="true" />
          <p className="font-body text-sm">{L('Няма заявки в тази секция.', 'No applications here.')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leads.map((l) => (
            <div key={l.id} className="border-2 border-border bg-card p-4 space-y-2">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h2 className="font-pixel text-[10px] text-foreground">{l.name}</h2>
                  <p className="font-body text-xs text-muted-foreground">
                    {[l.category, l.city, l.address].filter(Boolean).join(' · ')}
                  </p>
                </div>
                <span className="font-body text-[11px] text-muted-foreground">{new Date(l.created_at).toLocaleString()}</span>
              </div>
              <div className="font-body text-sm text-foreground space-y-0.5">
                {l.contact_person && <p>{l.contact_person}</p>}
                {l.contact_phone && <p><a className="text-[#C8E650] hover:underline" href={`tel:${l.contact_phone}`}>{l.contact_phone}</a></p>}
                {l.contact_email && <p><a className="text-[#C8E650] hover:underline" href={`mailto:${l.contact_email}`}>{l.contact_email}</a></p>}
                {l.website && <p className="break-all text-muted-foreground">{l.website}</p>}
                {l.message && <p className="text-muted-foreground whitespace-pre-wrap">{l.message}</p>}
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {STATUSES.filter((s) => s !== l.status).map((s) => (
                  <button
                    key={s}
                    disabled={setStatus.isPending}
                    onClick={() => setStatus.mutate({ id: l.id, status: s })}
                    className="border border-border px-3 py-1.5 font-pixel text-[7px] tracking-wider text-muted-foreground hover:text-foreground hover:border-[#A663E0] transition-colors disabled:opacity-50"
                  >
                    → {labels[s]}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
