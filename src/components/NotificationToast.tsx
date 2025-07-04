
import React, { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

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
            let title = '';
            let description = '';
            switch (newRecord.status) {
              case 'contacted':
                title = 'Quote Request Update';
                description = `Your quote request for "${newRecord.product_name}" has been reviewed and we will contact you soon.`;
                break;
              case 'completed':
                title = 'Quote Request Completed';
                description = `Your quote request for "${newRecord.product_name}" has been completed!`;
                break;
              case 'rejected':
                title = 'Quote Request Update';
                description = `Your quote request for "${newRecord.product_name}" has been updated.`;
                break;
              default:
                title = 'Quote Request Update';
                description = `Your quote request for "${newRecord.product_name}" status has been updated.`;
            }
            
            toast({
              title,
              description,
            });
          }
          
          if (newRecord.admin_response && newRecord.admin_response !== oldRecord.admin_response) {
            toast({
              title: 'New Response',
              description: `New response to your quote request: "${newRecord.admin_response}"`,
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
