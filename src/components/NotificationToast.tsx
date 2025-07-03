
import React, { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

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

    // Enhanced real-time subscription with better error handling
    channelRef.current = supabase
      .channel(`enhanced-notifications-${user.id}`)
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
          
          // Enhanced status change notifications
          if (newRecord.status !== oldRecord.status) {
            let message = '';
            let icon = '📦';
            
            switch (newRecord.status) {
              case 'contacted':
                message = `Your quote request for "${newRecord.product_name}" has been reviewed. We will contact you soon.`;
                icon = '📞';
                break;
              case 'approved':
                message = `Great news! Your quote request for "${newRecord.product_name}" has been approved!`;
                icon = '✅';
                break;
              case 'completed':
                message = `Your quote request for "${newRecord.product_name}" has been completed!`;
                icon = '🎉';
                break;
              case 'rejected':
                message = `Your quote request for "${newRecord.product_name}" needs attention.`;
                icon = '⚠️';
                break;
              default:
                message = `Your quote request for "${newRecord.product_name}" status has been updated.`;
            }
            
            toast.success(message, {
              duration: 6000,
              icon: icon,
              style: {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.2)',
              },
            });
          }
          
          // Enhanced admin response notifications
          if (newRecord.admin_response && newRecord.admin_response !== oldRecord.admin_response) {
            toast.info(`💬 New response for "${newRecord.product_name}": ${newRecord.admin_response}`, {
              duration: 8000,
              style: {
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.2)',
              },
            });
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
          
          if (newRecord.status !== oldRecord.status) {
            let message = '';
            let icon = '💼';
            
            switch (newRecord.status) {
              case 'shortlisted':
                message = `You've been shortlisted for the ${newRecord.interested_department} position!`;
                icon = '⭐';
                break;
              case 'hired':
                message = `Congratulations! You've been hired for the ${newRecord.interested_department} position!`;
                icon = '🎉';
                break;
              case 'rejected':
                message = `Thank you for your interest in the ${newRecord.interested_department} position.`;
                icon = '📧';
                break;
              default:
                message = `Your application for ${newRecord.interested_department} has been updated.`;
            }
            
            toast.success(message, {
              duration: 7000,
              icon: icon,
              style: {
                background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.2)',
              },
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
