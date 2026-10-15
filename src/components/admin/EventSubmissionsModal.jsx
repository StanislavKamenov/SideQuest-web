import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X, MapPin, Clock, Loader2, ExternalLink, Video, Image as ImageIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabaseClient';

const STATUS_STYLE = {
  completed: 'text-[#C8E650] border-[#C8E650]/40 bg-[#C8E650]/10',
  pending_review: 'text-[#E8C36A] border-[#E8C36A]/40 bg-[#E8C36A]/10',
  failed: 'text-[#E85D4A] border-[#E85D4A]/40 bg-[#E85D4A]/10',
  joined: 'text-muted-foreground border-border bg-muted/30',
};

const isVideoUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  const clean = url.split('?')[0].toLowerCase();
  return ['.mp4', '.mov', '.webm', '.m4v'].some((ext) => clean.endsWith(ext));
};

const toUrlList = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string' && value) return [value];
  return [];
};

/**
 * Everything a player sent for one event: who, when, the proof itself and the
 * GPS position captured at the moment the proof was submitted.
 */
export default function EventSubmissionsModal({ event, onClose }) {
  const { i18n } = useTranslation();
  const bg = i18n.language?.startsWith('bg');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error: rpcError } = await supabase.rpc('event_submissions', { p_mission_id: event.id });
      if (cancelled) return;
      if (rpcError) setError(rpcError.message);
      else setRows(data || []);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [event.id]);

  const label = {
    title: bg ? 'ИЗПРАТЕНИ ДОКАЗАТЕЛСТВА' : 'SUBMISSIONS',
    empty: bg ? 'Все още няма изпратени доказателства.' : 'No submissions yet.',
    location: bg ? 'Локация при изпращане' : 'Location when submitted',
    noLocation: bg ? 'Няма записана локация' : 'No location recorded',
    noProof: bg ? 'Все още няма доказателство' : 'No proof sent yet',
    open: bg ? 'Отвори в картата' : 'Open in map',
    status: {
      completed: bg ? 'ЗАВЪРШЕНО' : 'COMPLETED',
      pending_review: bg ? 'ЗА ПРЕГЛЕД' : 'IN REVIEW',
      failed: bg ? 'ОТХВЪРЛЕНО' : 'REJECTED',
      joined: bg ? 'ВКЛЮЧИЛ СЕ' : 'JOINED',
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card border border-border w-full max-w-3xl max-h-[88vh] flex flex-col"
      >
        <div className="flex items-start justify-between p-5 border-b border-border">
          <div>
            <p className="font-pixel text-[8px] text-[#C8E650] tracking-widest mb-2">{label.title}</p>
            <h2 className="font-pixel text-[10px] text-foreground tracking-wide leading-relaxed">{event.name}</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto p-5 space-y-4">
          {loading && (
            <div className="flex justify-center py-10">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          )}
          {error && <p className="font-body text-sm text-[#E85D4A]">{error}</p>}
          {!loading && !error && rows.length === 0 && (
            <p className="font-body text-sm text-muted-foreground text-center py-10">{label.empty}</p>
          )}

          {rows.map((r) => {
            const media = toUrlList(r.proof_urls);
            const hasLocation = r.proof_lat != null && r.proof_lng != null;
            const when = r.proof_submitted_at || r.completed_at;
            return (
              <div key={r.participant_id} className="border border-border bg-background/40 p-4">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 min-w-0">
                    {r.avatar_url ? (
                      <img src={r.avatar_url} alt="" className="w-7 h-7 rounded-full object-cover" />
                    ) : (
                      <span className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center font-pixel text-[8px]">
                        {(r.display_name || r.username || '?').charAt(0).toUpperCase()}
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="font-body text-sm text-foreground truncate">{r.display_name || r.username}</p>
                      <p className="font-body text-[11px] text-muted-foreground truncate">@{r.username}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 font-pixel text-[6px] tracking-wider border ${STATUS_STYLE[r.status] || STATUS_STYLE.joined}`}>
                    {label.status[r.status] || r.status}
                  </span>
                </div>

                {media.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                    {media.map((url) =>
                      isVideoUrl(url) ? (
                        <video key={url} src={url} controls preload="metadata" className="w-full aspect-square object-cover bg-black" />
                      ) : (
                        <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="block">
                          <img src={url} alt="" className="w-full aspect-square object-cover border border-border" loading="lazy" />
                        </a>
                      ),
                    )}
                  </div>
                ) : (
                  <p className="flex items-center gap-1.5 font-body text-[11px] text-muted-foreground mb-3">
                    <ImageIcon className="w-3 h-3" /> <Video className="w-3 h-3" /> {label.noProof}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 font-body text-[11px] text-muted-foreground">
                  {when && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      {new Date(when).toLocaleString()} ({formatDistanceToNow(new Date(when), { addSuffix: true })})
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3" />
                    {hasLocation ? (
                      <>
                        {label.location}: {Number(r.proof_lat).toFixed(5)}, {Number(r.proof_lng).toFixed(5)}
                        <a
                          href={`https://www.google.com/maps?q=${r.proof_lat},${r.proof_lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[#6B9FD4] hover:underline ml-1"
                        >
                          {label.open} <ExternalLink className="w-3 h-3" />
                        </a>
                      </>
                    ) : (
                      label.noLocation
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
