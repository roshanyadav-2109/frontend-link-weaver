
import React, { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const NotificationToast: React.FC = () => {
  const { user } = useAuth();
  const channelRef = useRef<any>(null);
  const processedNotifications = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!user) return;

    // Clean up existing channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    // Subscribe to quote request updates
    channelRef.current = supabase
      .channel(`quote-updates-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'quote_requests',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const newRecord = payload.new as any;
          const oldRecord = payload.old as any;
          
          // Create a unique identifier for this notification
          const notificationId = `${newRecord.id}-${newRecord.updated_at}`;
          
          // Skip if we've already processed this notification
          if (processedNotifications.current.has(notificationId)) {
            return;
          }
          
          processedNotifications.current.add(notificationId);
          
          if (newRecord.status !== oldRecord.status) {
            let message = '';
            switch (newRecord.status) {
              case 'contacted':
                message = `Your quote request for "${newRecord.product_name}" has been reviewed. We will contact you soon.`;
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
            toast.info(`New response: "${newRecord.admin_response}"`, {
              duration: 6000,
            });
          }
        }
      )
      .subscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [user]);

  return null;
};

export default NotificationToast;
