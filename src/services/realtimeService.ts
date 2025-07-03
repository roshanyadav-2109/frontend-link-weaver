
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

class RealtimeService {
  private channels: Map<string, any> = new Map();

  // Products real-time sync
  subscribeToProducts(callback: (products: any[]) => void) {
    const channelName = 'products-sync';
    
    if (this.channels.has(channelName)) {
      this.channels.get(channelName).unsubscribe();
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        async () => {
          try {
            const { data, error } = await supabase
              .from('products')
              .select('*')
              .order('created_at', { ascending: false });
            
            if (!error && data) {
              callback(data);
            }
          } catch (err) {
            console.error('Error syncing products:', err);
          }
        }
      )
      .subscribe();

    this.channels.set(channelName, channel);
    return channel;
  }

  // Quote requests real-time sync
  subscribeToQuoteRequests(callback: (quotes: any[]) => void, userId?: string) {
    const channelName = userId ? `quotes-user-${userId}` : 'quotes-admin';
    
    if (this.channels.has(channelName)) {
      this.channels.get(channelName).unsubscribe();
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quote_requests',
          filter: userId ? `user_id=eq.${userId}` : undefined
        },
        async (payload) => {
          try {
            const filter = userId ? 
              supabase.from('quote_requests').select('*').eq('user_id', userId) :
              supabase.from('quote_requests').select('*');
            
            const { data, error } = await filter.order('created_at', { ascending: false });
            
            if (!error && data) {
              callback(data);
            }

            // Show notification for status changes
            if (payload.eventType === 'UPDATE' && payload.new && payload.old) {
              const newRecord = payload.new as any;
              const oldRecord = payload.old as any;
              
              if (newRecord.status !== oldRecord.status) {
                toast.success(`Quote "${newRecord.product_name}" status updated to: ${newRecord.status}`);
              }
              
              if (newRecord.admin_response && newRecord.admin_response !== oldRecord.admin_response) {
                toast.info(`New response for "${newRecord.product_name}": ${newRecord.admin_response}`);
              }
            }
          } catch (err) {
            console.error('Error syncing quote requests:', err);
          }
        }
      )
      .subscribe();

    this.channels.set(channelName, channel);
    return channel;
  }

  // Job applications real-time sync
  subscribeToJobApplications(callback: (applications: any[]) => void, userId?: string) {
    const channelName = userId ? `jobs-user-${userId}` : 'jobs-admin';
    
    if (this.channels.has(channelName)) {
      this.channels.get(channelName).unsubscribe();
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'job_applications',
          filter: userId ? `user_id=eq.${userId}` : undefined
        },
        async (payload) => {
          try {
            const filter = userId ? 
              supabase.from('job_applications').select('*').eq('user_id', userId) :
              supabase.from('job_applications').select('*');
            
            const { data, error } = await filter.order('created_at', { ascending: false });
            
            if (!error && data) {
              callback(data);
            }

            // Show notification for status changes
            if (payload.eventType === 'UPDATE' && payload.new && payload.old) {
              const newRecord = payload.new as any;
              const oldRecord = payload.old as any;
              
              if (newRecord.status !== oldRecord.status) {
                toast.success(`Application for "${newRecord.interested_department}" status updated to: ${newRecord.status}`);
              }
            }
          } catch (err) {
            console.error('Error syncing job applications:', err);
          }
        }
      )
      .subscribe();

    this.channels.set(channelName, channel);
    return channel;
  }

  // Careers real-time sync
  subscribeToCareers(callback: (careers: any[]) => void) {
    const channelName = 'careers-sync';
    
    if (this.channels.has(channelName)) {
      this.channels.get(channelName).unsubscribe();
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'careers'
        },
        async () => {
          try {
            const { data, error } = await supabase
              .from('careers')
              .select('*')
              .eq('status', 'active')
              .order('created_at', { ascending: false });
            
            if (!error && data) {
              callback(data);
            }
          } catch (err) {
            console.error('Error syncing careers:', err);
          }
        }
      )
      .subscribe();

    this.channels.set(channelName, channel);
    return channel;
  }

  // Contact form submissions real-time sync
  subscribeToContactSubmissions(callback: (submissions: any[]) => void) {
    const channelName = 'contact-sync';
    
    if (this.channels.has(channelName)) {
      this.channels.get(channelName).unsubscribe();
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'contact_submissions'
        },
        async () => {
          try {
            const { data, error } = await supabase
              .from('contact_submissions')
              .select('*')
              .order('created_at', { ascending: false });
            
            if (!error && data) {
              callback(data);
              toast.success('New contact form submission received!');
            }
          } catch (err) {
            console.error('Error syncing contact submissions:', err);
          }
        }
      )
      .subscribe();

    this.channels.set(channelName, channel);
    return channel;
  }

  // General applications real-time sync
  subscribeToGeneralApplications(callback: (applications: any[]) => void) {
    const channelName = 'general-apps-sync';
    
    if (this.channels.has(channelName)) {
      this.channels.get(channelName).unsubscribe();
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'general_applications'
        },
        async () => {
          try {
            const { data, error } = await supabase
              .from('general_applications')
              .select('*')
              .order('created_at', { ascending: false });
            
            if (!error && data) {
              callback(data);
            }
          } catch (err) {
            console.error('Error syncing general applications:', err);
          }
        }
      )
      .subscribe();

    this.channels.set(channelName, channel);
    return channel;
  }

  // Manufacturer partnerships real-time sync
  subscribeToManufacturerPartnerships(callback: (partnerships: any[]) => void) {
    const channelName = 'partnerships-sync';
    
    if (this.channels.has(channelName)) {
      this.channels.get(channelName).unsubscribe();
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'manufacturer_partnerships'
        },
        async () => {
          try {
            const { data, error } = await supabase
              .from('manufacturer_partnerships')
              .select('*')
              .order('created_at', { ascending: false });
            
            if (!error && data) {
              callback(data);
            }
          } catch (err) {
            console.error('Error syncing partnerships:', err);
          }
        }
      )
      .subscribe();

    this.channels.set(channelName, channel);
    return channel;
  }

  // Cleanup method
  unsubscribeAll() {
    this.channels.forEach((channel) => {
      supabase.removeChannel(channel);
    });
    this.channels.clear();
  }

  unsubscribe(channelName: string) {
    const channel = this.channels.get(channelName);
    if (channel) {
      supabase.removeChannel(channel);
      this.channels.delete(channelName);
    }
  }
}

export const realtimeService = new RealtimeService();
