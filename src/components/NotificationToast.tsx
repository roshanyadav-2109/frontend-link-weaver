
import React, { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const NotificationToast: React.FC = () => {
  const { user } = useAuth();
  const channelRef = useRef<any>(null);
  const processedNotifications = useRef<Set<string>>(new Set());
  const lastProcessedTime = useRef<number>(Date.now());

  useEffect(() => {
    if (!user) return;
    
    // Clean up existing channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    // Create unique channel name with timestamp to prevent duplicates
    const channelName = `notifications-${user.id}-${Date.now()}`;
    
    channelRef.current = supabase
      .channel(channelName)
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
          
          // Only process recent updates to avoid old notifications
          const updateTime = new Date(newRecord.updated_at).getTime();
          if (updateTime <= lastProcessedTime.current) return;
          
          const notificationId = `quote-${newRecord.id}-${newRecord.status}-${updateTime}`;
          
          if (processedNotifications.current.has(notificationId)) return;
          processedNotifications.current.add(notificationId);
          
          // Status change notification
          if (newRecord.status !== oldRecord.status) {
            let message = '';
            switch (newRecord.status) {
              case 'contacted':
                message = `Your quote request for "${newRecord.product_name}" is being reviewed.`;
                break;
              case 'approved':
                message = `Great news! Your quote request for "${newRecord.product_name}" has been approved!`;
                break;
              case 'completed':
                message = `Your quote request for "${newRecord.product_name}" has been completed!`;
                break;
              case 'rejected':
                message = `Your quote request for "${newRecord.product_name}" status has been updated.`;
                break;
              default:
                message = `Your quote request status: ${newRecord.status}`;
            }
            
            toast.success(message, { duration: 4000 });
          }
          
          // Admin response notification
          if (newRecord.admin_response && newRecord.admin_response !== oldRecord.admin_response) {
            const responseId = `response-${newRecord.id}-${updateTime}`;
            if (!processedNotifications.current.has(responseId)) {
              processedNotifications.current.add(responseId);
              toast.info(`New response: "${newRecord.admin_response}"`, { duration: 5000 });
            }
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'job_applications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const newRecord = payload.new as any;
          const oldRecord = payload.old as any;
          
          const updateTime = new Date(newRecord.updated_at).getTime();
          if (updateTime <= lastProcessedTime.current) return;
          
          const notificationId = `job-${newRecord.id}-${newRecord.status}-${updateTime}`;
          
          if (!processedNotifications.current.has(notificationId)) {
            processedNotifications.current.add(notificationId);
            
            if (newRecord.status !== oldRecord.status) {
              toast.success(`Your application status updated: ${newRecord.status.replace('_', ' ')}`, {
                duration: 4000,
              });
            }
          }
        }
      )
      .subscribe();

    // Update last processed time
    lastProcessedTime.current = Date.now();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [user?.id]);

  return null;
};

export default NotificationToast;
