
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
    
    isInitializedRef.current = true;

    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    channelRef.current = supabase
      .channel(`user-notifications-${user.id}-${Date.now()}`)
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
          
          const notificationId = `quote-${newRecord.id}-${newRecord.updated_at}-${newRecord.status}`;
          
          if (processedNotifications.current.has(notificationId)) {
            return;
          }
          
          processedNotifications.current.add(notificationId);
          
          if (processedNotifications.current.size > 20) {
            const items = Array.from(processedNotifications.current);
            processedNotifications.current = new Set(items.slice(-10));
          }
          
          if (newRecord.status !== oldRecord.status) {
            let message = '';
            switch (newRecord.status) {
              case 'contacted':
                message = `Your quote request for "${newRecord.product_name}" is being reviewed.`;
                break;
              case 'approved':
                message = `Your quote request for "${newRecord.product_name}" has been approved!`;
                break;
              case 'completed':
                message = `Your quote request for "${newRecord.product_name}" has been completed!`;
                break;
              case 'rejected':
                message = `Your quote request for "${newRecord.product_name}" has been updated.`;
                break;
              default:
                message = `Your quote request for "${newRecord.product_name}" status: ${newRecord.status}`;
            }
            
            toast.success(message, {
              duration: 4000,
            });
          }
          
          if (newRecord.admin_response && newRecord.admin_response !== oldRecord.admin_response) {
            const responseId = `response-${newRecord.id}-${newRecord.admin_response.slice(0, 20)}`;
            
            if (!processedNotifications.current.has(responseId)) {
              processedNotifications.current.add(responseId);
              toast.info(`New response: "${newRecord.admin_response}"`, {
                duration: 5000,
              });
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
          
          const notificationId = `job-${newRecord.id}-${newRecord.updated_at}-${newRecord.status}`;
          
          if (!processedNotifications.current.has(notificationId)) {
            processedNotifications.current.add(notificationId);
            
            if (newRecord.status !== oldRecord.status) {
              toast.success(`Your application for ${newRecord.interested_department} status: ${newRecord.status.replace('_', ' ')}`, {
                duration: 4000,
              });
            }
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
  }, [user?.id]);

  return null;
};

export default NotificationToast;
