
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface QuoteRequest {
  id: string;
  created_at: string;
  product_id?: string | null;
  user_id: string;
  status?: string | null;
  product_name: string;
  quantity: string;
  unit: string;
  additional_details?: string | null;
  name: string;
  email: string;
  phone: string;
  company?: string | null;
  admin_response?: string | null;
  delivery_address?: string | null;
  delivery_country?: string | null;
  delivery_timeline?: string | null;
  payment_terms?: string | null;
  packaging_requirements?: string | null;
  quality_standards?: string | null;
  sample_required?: boolean | null;
  estimated_budget?: string | null;
  shipping_terms?: string | null;
  priority_level?: string | null;
  attachments?: string[] | null;
}

export const useRealtimeQuotes = () => {
  const { user } = useAuth();
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchQuotes = async () => {
      try {
        const { data, error } = await supabase
          .from('quote_requests')
          .select('*')
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

    fetchQuotes();

    // Subscribe to real-time updates
    const channel = supabase
      .channel(`quote-updates-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quote_requests',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const { eventType, new: newRecord, old: oldRecord } = payload;
          
          if (eventType === 'INSERT') {
            setQuotes(prev => [newRecord as QuoteRequest, ...prev]);
          } else if (eventType === 'UPDATE') {
            setQuotes(prev => prev.map(quote => 
              quote.id === newRecord.id ? newRecord as QuoteRequest : quote
            ));
            
            // Show notification for status changes
            if (newRecord.status !== oldRecord?.status) {
              toast.success(`Quote status updated to: ${newRecord.status}`);
            }
            
            if (newRecord.admin_response && newRecord.admin_response !== oldRecord?.admin_response) {
              toast.info('New admin response received');
            }
          } else if (eventType === 'DELETE') {
            setQuotes(prev => prev.filter(quote => quote.id !== oldRecord.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { quotes, loading };
};
