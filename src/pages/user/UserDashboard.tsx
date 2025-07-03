import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { User, ShoppingCart, FileText, Settings, Bell, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import PageTransition from '@/components/animations/PageTransition';
import FadeInSection from '@/components/animations/FadeInSection';
import SlideIn from '@/components/animations/SlideIn';

interface QuoteRequest {
  id: string;
  product_name: string;
  quantity: string;
  status: string;
  created_at: string;
  admin_response?: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's quote requests and notifications
  const fetchUserData = async () => {
    if (!user) return;

    try {
      // Fetch quote requests
      const { data: quotes, error: quotesError } = await supabase
        .from('quote_requests')
        .select('id, product_name, quantity, status, created_at, admin_response')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (quotesError) throw quotesError;
      setQuoteRequests(quotes || []);

      // Fetch notifications
      const { data: notifs, error: notifsError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (notifsError) throw notifsError;
      setNotifications(notifs || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();

    // Set up real-time subscriptions only once
    if (!user?.id) return;

    const quotesChannel = supabase
      .channel(`user-quotes-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quote_requests',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Real-time quote update:', payload);
          fetchUserData();
          
          // Show notification for status changes
          if (payload.eventType === 'UPDATE' && payload.new.status !== payload.old?.status) {
            toast.success('Quote request status updated!', {
              description: `Status changed to: ${payload.new.status}`
            });
          }
        }
      )
      .subscribe();

    const notificationsChannel = supabase
      .channel(`user-notifications-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('New notification:', payload);
          fetchUserData();
          
          // Show toast for new notifications
          toast.info('New notification!', {
            description: payload.new.title
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(quotesChannel);
      supabase.removeChannel(notificationsChannel);
    };
  }, [user?.id]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <PageTransition className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <FadeInSection className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
          <p className="text-gray-600 mt-2">Manage your account and track your activities</p>
        </FadeInSection>

        {/* Recent Activity Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Quote Requests */}
          <SlideIn direction="left" delay={0.1}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <ShoppingCart className="h-5 w-5 mr-2 text-brand-blue" />
                  Recent Quote Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                {quoteRequests.length > 0 ? (
                  <div className="space-y-3">
                    {quoteRequests.map((quote) => (
                      <div key={quote.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{quote.product_name}</p>
                          <p className="text-xs text-gray-600">Qty: {quote.quantity}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(quote.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(quote.status)}
                          <Badge className={`text-xs ${getStatusColor(quote.status)}`}>
                            {quote.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    <Link to="/request-quote">
                      <Button variant="outline" size="sm" className="w-full mt-3">
                        View All Requests
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500 text-sm">No quote requests yet</p>
                    <Link to="/request-quote">
                      <Button size="sm" className="mt-2">
                        Request Your First Quote
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </SlideIn>

          {/* Recent Notifications */}
          <SlideIn direction="right" delay={0.2}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Bell className="h-5 w-5 mr-2 text-brand-blue" />
                  Recent Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                {notifications.length > 0 ? (
                  <div className="space-y-3">
                    {notifications.map((notification) => (
                      <div key={notification.id} className={`p-3 rounded-lg ${
                        notification.is_read ? 'bg-gray-50' : 'bg-blue-50 border-l-4 border-brand-blue'
                      }`}>
                        <p className="font-medium text-sm">{notification.title}</p>
                        <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(notification.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500 text-sm">No notifications yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </SlideIn>
        </div>

        {/* Main Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[
            { icon: User, title: 'Profile', desc: 'Manage your personal information and preferences', link: '/auth/update-profile-client', button: 'Update Profile' },
            { icon: ShoppingCart, title: 'Quote Requests', desc: 'View and track your product quote requests', link: '/request-quote', button: 'New Quote Request' },
            { icon: FileText, title: 'Catalog Requests', desc: 'Request product catalogs from manufacturers', link: '/catalog-request', button: 'Request Catalog' }
          ].map((item, index) => (
            <SlideIn key={item.title} direction="up" delay={0.1 * (index + 3)}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-lg">
                    <item.icon className="h-5 w-5 mr-2 text-brand-blue" />
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{item.desc}</p>
                  <Link to={item.link}>
                    <Button variant="outline" className="w-full">
                      {item.button}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </SlideIn>
          ))}
        </div>

        {/* Quick Actions */}
        <SlideIn direction="up" delay={0.6}>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: ShoppingCart, text: 'Browse Products', link: '/products' },
                  { icon: FileText, text: 'Contact Us', link: '/contact' },
                  { icon: User, text: 'Careers', link: '/careers' },
                  { icon: Settings, text: 'About Us', link: '/about' }
                ].map((action) => (
                  <Link key={action.text} to={action.link}>
                    <Button variant="ghost" className="w-full h-auto p-4 flex flex-col items-center">
                      <action.icon className="h-6 w-6 mb-2" />
                      {action.text}
                    </Button>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </SlideIn>
      </div>
    </PageTransition>
  );
};

export default UserDashboard;
