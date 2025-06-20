
import React, { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const NotificationToast: React.FC = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Subscribe to quote request updates
    const channel = supabase
      .channel('quote-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'quote_requests',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Quote request updated:', payload);
          const newRecord = payload.new as any;
          const oldRecord = payload.old as any;
          
          if (newRecord.status !== oldRecord.status) {
            let message = '';
            switch (newRecord.status) {
              case 'contacted':
                message = `Your quote request for "${newRecord.product_name}" has been reviewed and we will contact you soon.`;
                break;
              case 'completed':
                message = `Your quote request for "${newRecord.product_name}" has been completed!`;
                break;
              case 'rejected':
                message = `Your quote request for "${newRecord.product_name}" has been updated.`;
                break;
              default:
                message = `Your quote request for "${newRecord.product_name}" status has been updated.`;
            }
            
            toast.success(message, {
              duration: 5000,
            });
          }
          
          if (newRecord.admin_response && newRecord.admin_response !== oldRecord.admin_response) {
            toast.info(`New response to your quote request: "${newRecord.admin_response}"`, {
              duration: 7000,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return null;
};

export default NotificationToast;
