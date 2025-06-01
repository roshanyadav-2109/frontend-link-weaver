
import { supabase } from '@/integrations/supabase/client';

export interface CreateNotificationParams {
  userId: string;
  title: string;
  message: string;
  type?: 'quote' | 'catalogue' | 'admin' | 'general';
  relatedQuoteId?: string;
}

export class NotificationService {
  static async createNotification(params: CreateNotificationParams) {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: params.userId,
          title: params.title,
          message: params.message,
          type: params.type || 'general',
          related_quote_id: params.relatedQuoteId || null,
          is_read: false
        });

      if (error) {
        console.error('Error creating notification:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Failed to create notification:', error);
      return false;
    }
  }

  static async notifyQuoteCreated(userId: string, productName: string, quoteId: string) {
    return this.createNotification({
      userId,
      title: 'Quote Request Submitted',
      message: `Your quote request for "${productName}" has been submitted successfully. We'll get back to you soon.`,
      type: 'quote',
      relatedQuoteId: quoteId
    });
  }

  static async notifyQuoteUpdated(userId: string, productName: string, status: string, quoteId: string) {
    const statusMessages = {
      processing: 'is being processed',
      quoted: 'has received a quote',
      accepted: 'has been accepted',
      rejected: 'has been declined'
    };

    const message = statusMessages[status as keyof typeof statusMessages] || `status has been updated to ${status}`;

    return this.createNotification({
      userId,
      title: 'Quote Status Update',
      message: `Your quote request for "${productName}" ${message}.`,
      type: 'quote',
      relatedQuoteId: quoteId
    });
  }

  static async notifyAdminNewQuote(productName: string, customerName: string) {
    // Get all admin users
    const { data: admins } = await supabase
      .from('profiles')
      .select('id')
      .eq('is_admin', true);

    if (admins && admins.length > 0) {
      const notifications = admins.map(admin => ({
        user_id: admin.id,
        title: 'New Quote Request',
        message: `${customerName} has submitted a quote request for "${productName}".`,
        type: 'admin' as const,
        is_read: false
      }));

      const { error } = await supabase
        .from('notifications')
        .insert(notifications);

      if (error) {
        console.error('Error notifying admins:', error);
      }
    }
  }
}
