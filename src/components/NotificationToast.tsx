
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

    // Subscribe to quote request updates with enhanced notifications
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
            let toastType: 'success' | 'info' | 'warning' = 'info';
            
            switch (newRecord.status) {
              case 'contacted':
                message = `Your quote request for "${newRecord.product_name}" has been reviewed. We will contact you soon.`;
                toastType = 'info';
                break;
              case 'completed':
                message = `Your quote request for "${newRecord.product_name}" has been completed! 🎉`;
                toastType = 'success';
                break;
              case 'rejected':
                message = `Your quote request for "${newRecord.product_name}" has been updated.`;
                toastType = 'warning';
                break;
              default:
                message = `Your quote request for "${newRecord.product_name}" status has been updated to: ${newRecord.status}`;
                toastType = 'info';
            }
            
            if (toastType === 'success') {
              toast.success(message, {
                duration: 6000,
                className: 'animate-slide-in-right',
              });
            } else if (toastType === 'warning') {
              toast.warning(message, {
                duration: 5000,
                className: 'animate-slide-in-right',
              });
            } else {
              toast.info(message, {
                duration: 5000,
                className: 'animate-slide-in-right',
              });
            }
          }
          
          if (newRecord.admin_response && newRecord.admin_response !== oldRecord.admin_response) {
            toast.info(`💬 New response: "${newRecord.admin_response}"`, {
              duration: 7000,
              className: 'animate-scale-in',
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
