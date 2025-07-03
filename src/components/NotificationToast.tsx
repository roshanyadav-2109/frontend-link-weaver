import React, { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const NotificationToast: React.FC = () => {
  const { user } = useAuth();
  const channelRef = useRef<any>(null);
  const processedNotifications = useRef<Set<string>>(new Set());
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (!user || isInitializedRef.current) return;
    
    // Mark as initialized to prevent duplicate subscriptions
    isInitializedRef.current = true;

    // Clean up existing channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    // Subscribe to quote request updates
    channelRef.current = supabase
      .channel(`notifications-${user.id}-${Date.now()}`) // Unique channel name
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
          const notificationId = `${newRecord.id}-${newRecord.updated_at}-${newRecord.status}`;
          
          // Skip if we've already processed this notification
          if (processedNotifications.current.has(notificationId)) {
            return;
          }
          
          processedNotifications.current.add(notificationId);
          
          // Clean up old notifications (keep only last 50)
          if (processedNotifications.current.size > 50) {
            const items = Array.from(processedNotifications.current);
            processedNotifications.current = new Set(items.slice(-25));
          }
          
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
      isInitializedRef.current = false;
    };
  }, [user?.id]); // Only depend on user.id to prevent re-runs

  return null;
};

export default NotificationToast;
