import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Users, Search, Loader2, ShieldAlert, ShieldCheck } from 'lucide-react';

export default function SysAdminPlayers() {
  const [search, setSearch] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: players, isLoading } = useQuery({
    queryKey: ['sysadmin-players', search],
    queryFn: async () => {
      let q = supabase
        .from('profiles')
        .select('*')
        .order('xp', { ascending: false })
        .limit(50);
        
      if (search) {
        q = q.ilike('username', `%${search}%`);
      }
      
      const { data, error } = await q;
      if (error) throw error;
      return data;
    }
  });

  const toggleAdmin = useMutation({
    mutationFn: async ({ id, is_admin }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update({ is_admin })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['sysadmin-players']);
      toast({ 
        title: data.is_admin ? 'Admin Rights Granted' : 'Admin Rights Revoked', 
        className: 'bg-[#C8E650] text-black font-pixel' 
      });
    },
    onError: (err) => {
      toast({ title: 'Failed to update user', description: err.message, variant: 'destructive', className: 'font-pixel' });
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-[#A663E0]" />
          <h1 className="font-pixel text-xl text-foreground tracking-tight">
            PLAYERS
          </h1>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-card border border-border pl-10 pr-4 py-3 font-body text-sm text-foreground focus:border-[#A663E0] focus:outline-none transition-colors"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#A663E0]" />
        </div>
      ) : players?.length === 0 ? (
        <div className="bg-card border border-border p-12 text-center text-muted-foreground font-pixel text-[10px]">
          NO PLAYERS FOUND
        </div>
      ) : (
        <div className="space-y-4">
          {players?.map(player => (
            <div key={player.id} className={`bg-card border p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${player.is_admin || player.role === 'admin' ? 'border-[#A663E0]/50 bg-[#A663E0]/5' : 'border-border'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 border flex items-center justify-center ${player.is_admin || player.role === 'admin' ? 'bg-[#A663E0]/20 border-[#A663E0]/40 text-[#A663E0]' : 'bg-secondary/50 border-border text-muted-foreground'}`}>
                  {player.avatar_url ? (
                    <img src={player.avatar_url} alt={player.username} className="w-full h-full object-cover" />
                  ) : (
                    <Users className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-pixel text-sm text-foreground">{player.username || 'Unknown'}</h3>
                    {(player.is_admin || player.role === 'admin') && (
                      <span className="bg-[#A663E0]/20 text-[#A663E0] px-2 py-0.5 font-pixel text-[6px] tracking-widest border border-[#A663E0]/40">
                        ADMIN
                      </span>
                    )}
                  </div>
                  <p className="font-body text-xs text-muted-foreground mt-1">
                    {player.role || 'user'} • {player.xp || 0} XP • Rank: {player.rank || 'Recruit'}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => toggleAdmin.mutate({ id: player.id, is_admin: !player.is_admin })}
                disabled={toggleAdmin.isPending || player.role === 'admin'}
                className={`flex items-center gap-2 px-4 py-2 border font-pixel text-[8px] transition-colors ${
                  player.role === 'admin'
                    ? 'opacity-50 cursor-not-allowed bg-transparent border-border text-muted-foreground'
                    : player.is_admin 
                      ? 'bg-[#E85D4A]/10 border-[#E85D4A]/50 text-[#E85D4A] hover:bg-[#E85D4A]/20' 
                      : 'bg-[#A663E0]/10 border-[#A663E0]/50 text-[#A663E0] hover:bg-[#A663E0]/20'
                }`}
                title={player.role === 'admin' ? "Superadmin rights cannot be revoked" : ""}
              >
                {player.is_admin ? (
                  <><ShieldAlert className="w-3 h-3" /> REVOKE ADMIN</>
                ) : (
                  <><ShieldCheck className="w-3 h-3" /> MAKE ADMIN</>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
