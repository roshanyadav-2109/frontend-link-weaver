
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface UseRealtimeSyncOptions {
  table: string;
  onUpdate?: (payload: any) => void;
  onInsert?: (payload: any) => void;
  onDelete?: (payload: any) => void;
  filter?: string;
}

export const useRealtimeSync = (options: UseRealtimeSyncOptions) => {
  const { user } = useAuth();
  const channelRef = useRef<any>(null);
  const { table, onUpdate, onInsert, onDelete, filter } = options;

  useEffect(() => {
    if (!user && filter?.includes('user_id')) return;

    // Clean up existing channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    // Create unique channel name
    const channelName = `${table}-${user?.id || 'public'}-${Date.now()}`;

    // Subscribe to changes
    channelRef.current = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
          ...(filter && { filter })
        },
        (payload) => {
          console.log(`Real-time ${table} update:`, payload);
          
          switch (payload.eventType) {
            case 'INSERT':
              onInsert?.(payload);
              break;
            case 'UPDATE':
              onUpdate?.(payload);
              break;
            case 'DELETE':
              onDelete?.(payload);
              break;
          }
        }
      )
      .subscribe((status) => {
        console.log(`${table} subscription status:`, status);
        if (status === 'CHANNEL_ERROR') {
          console.error(`Failed to subscribe to ${table} changes`);
        }
      });

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [user?.id, table, filter]);

  return { channelRef: channelRef.current };
};
