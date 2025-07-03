
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface QuoteRequest {
  id: string;
  product_name: string;
  quantity: string;
  status: string;
  created_at: string;
  admin_response?: string;
}

export const useRealtimeQuotes = () => {
  const { user } = useAuth();
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQuotes = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('quote_requests')
        .select('id, product_name, quantity, status, created_at, admin_response')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuotes(data || []);
    } catch (error) {
      console.error('Error fetching quotes:', error);
      toast.error('Failed to load quotes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;

    fetchQuotes();

    // Set up real-time subscription
    const channel = supabase
      .channel(`user-quotes-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quote_requests',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Real-time quote update:', payload);
          
          if (payload.eventType === 'INSERT') {
            setQuotes(prev => [payload.new as QuoteRequest, ...prev]);
            toast.success('New quote request submitted!');
          } else if (payload.eventType === 'UPDATE') {
            const updated = payload.new as QuoteRequest;
            const old = payload.old as QuoteRequest;
            
            setQuotes(prev => 
              prev.map(quote => 
                quote.id === updated.id ? updated : quote
              )
            );
            
            if (updated.status !== old.status) {
              toast.success(`Quote "${updated.product_name}" status updated to: ${updated.status}`);
            }
            
            if (updated.admin_response && updated.admin_response !== old.admin_response) {
              toast.info(`New response for "${updated.product_name}": ${updated.admin_response}`);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return { quotes, loading, refetch: fetchQuotes };
};
