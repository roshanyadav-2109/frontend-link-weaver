import React, { useState, useEffect } from 'react';
import { 
  Package, 
  TrendingUp,
  FileText,
  MessageSquare,
  ShoppingCart,
  Clock,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Briefcase,
  Bell,
  Activity,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatedCard } from '@/components/ui/animated-card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useRealtimeQuotes } from '@/hooks/useRealtimeQuotes';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface QuoteRequest {
  id: string;
  product_name: string;
  quantity: string;
  status: string;
  created_at: string;
  admin_response?: string;
}

interface JobApplication {
  id: string;
  applicant_name: string;
  interested_department: string;
  status: string;
  created_at: string;
  admin_notes?: string;
}

const UserDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const { quotes } = useRealtimeQuotes();
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch quote requests
      const { data: quotes, error: quotesError } = await supabase
        .from('quote_requests')
        .select('id, product_name, quantity, status, created_at, admin_response')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (quotesError) {
        console.error('Error fetching quote requests:', quotesError);
      } else {
        
      }

      // Fetch job applications
      const { data: applications, error: applicationsError } = await supabase
        .from('job_applications')
        .select('id, applicant_name, interested_department, status, created_at, admin_notes')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (applicationsError) {
        console.error('Error fetching job applications:', applicationsError);
      } else {
        setJobApplications(applications || []);
      }

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Set up real-time subscriptions
    const quoteChannel = supabase
      .channel('user_dashboard_quotes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quote_requests',
          filter: `user_id=eq.${user?.id}`
        },
        (payload) => {
          console.log('Quote request updated:', payload);
          fetchDashboardData();
          
          if (payload.eventType === 'UPDATE') {
            const newRecord = payload.new as QuoteRequest;
            toast.success(`Quote request "${newRecord.product_name}" status updated to: ${newRecord.status}`, {
              duration: 5000,
            });
          }
        }
      )
      .subscribe();

    const applicationChannel = supabase
      .channel('user_dashboard_applications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'job_applications',
          filter: `user_id=eq.${user?.id}`
        },
        (payload) => {
          console.log('Job application updated:', payload);
          fetchDashboardData();
          
          if (payload.eventType === 'UPDATE') {
            const newRecord = payload.new as JobApplication;
            toast.success(`Your application for ${newRecord.interested_department} status updated to: ${newRecord.status.replace('_', ' ')}`, {
              duration: 5000,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(quoteChannel);
      supabase.removeChannel(applicationChannel);
    };
  }, [user?.id]);

  const statCards = [
    {
      title: 'Total Quote Requests',
      value: quotes.length.toString(),
      change: `${quotes.filter(q => q.status === 'pending').length} pending`,
      icon: <FileText className="h-8 w-8 text-brand-blue" />,
      color: 'from-blue-500 to-brand-blue',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Job Applications',
      value: jobApplications.length.toString(),
      change: `${jobApplications.filter(a => a.status === 'pending').length} pending`,
      icon: <Briefcase className="h-8 w-8 text-green-500" />,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Approved Quotes',
      value: quotes.filter(q => q.status === 'approved').length.toString(),
      change: 'Ready for processing',
      icon: <CheckCircle className="h-8 w-8 text-emerald-500" />,
      color: 'from-emerald-500 to-green-600',
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'In Progress',
      value: quotes.filter(q => q.status === 'contacted').length.toString(),
      change: 'Being processed',
      icon: <Clock className="h-8 w-8 text-orange-500" />,
      color: 'from-orange-500 to-amber-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
      case 'shortlisted':
      case 'hired':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'contacted':
      case 'under_review':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'approved':
      case 'shortlisted':
      case 'hired':
        return <CheckCircle className="h-4 w-4" />;
      case 'contacted':
      case 'under_review':
        return <MessageSquare className="h-4 w-4" />;
      case 'rejected':
        return <AlertCircle className="h-4 w-4" />;
      case 'completed':
        return <Package className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-teal-50/30 pt-24">
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          className="flex flex-col md:flex-row md:items-center justify-between mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-brand-blue to-brand-teal bg-clip-text text-transparent">
              Welcome Back!
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              {profile?.full_name || user?.email?.split('@')[0]}, here's your dashboard overview
            </p>
          </div>
          
          <motion.div 
            className="mt-4 md:mt-0 flex items-center gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-white/50">
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-500" />
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            </div>
            <Button onClick={fetchDashboardData} variant="outline" size="sm" className="bg-white/80 backdrop-blur-sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </motion.div>
        </motion.div>

        {/* Enhanced Stats Cards with Gradient Backgrounds */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => (
            <AnimatedCard 
              key={index} 
              delay={index * 0.1}
              className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-5`}></div>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative">
                <CardTitle className="text-sm font-medium text-gray-600">{card.title}</CardTitle>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  {card.icon}
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-gray-900">{card.value}</div>
                <motion.p 
                  className="text-xs text-gray-500 flex items-center mt-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  {card.change}
                </motion.p>
              </CardContent>
            </AnimatedCard>
          ))}
        </div>

        {/* Enhanced Main Content Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Quote Requests with Real-time Updates */}
          <AnimatedCard className="bg-white/80 backdrop-blur-sm border-0 shadow-lg" delay={0.4}>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <FileText className="h-5 w-5 text-brand-blue" />
                </div>
                Recent Quote Requests
                <div className="ml-auto flex items-center gap-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-2 h-2 bg-green-500 rounded-full"
                  />
                  <span className="text-sm font-normal text-green-600">Live</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {quotes.length > 0 ? (
                  quotes.slice(0, 5).map((request, index) => (
                    <motion.div 
                      key={request.id} 
                      className="p-4 bg-gradient-to-r from-gray-50 to-blue-50/50 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{request.product_name}</p>
                          <p className="text-sm text-gray-500">Quantity: {request.quantity}</p>
                          {request.admin_response && (
                            <motion.p 
                              className="text-sm text-blue-600 mt-2 bg-blue-50 p-2 rounded-lg border border-blue-100"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                            >
                              Response: {request.admin_response}
                            </motion.p>
                          )}
                        </div>
                        <div className="text-right ml-4">
                          <Badge className={`text-xs px-3 py-1 rounded-full border flex items-center gap-1 ${getStatusColor(request.status)}`}>
                            {getStatusIcon(request.status)}
                            {request.status}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">{formatDate(request.created_at)}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="font-medium">No quote requests yet</p>
                    <p className="text-sm">Start by browsing our products</p>
                  </div>
                )}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100">
                <Link to="/request-quote">
                  <Button className="w-full bg-gradient-to-r from-brand-blue to-brand-teal hover:from-brand-teal hover:to-brand-blue">
                    <FileText className="h-4 w-4 mr-2" />
                    New Quote Request
                  </Button>
                </Link>
              </div>
            </CardContent>
          </AnimatedCard>

          {/* Enhanced Job Applications */}
          <AnimatedCard className="bg-white/80 backdrop-blur-sm border-0 shadow-lg" delay={0.5}>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Briefcase className="h-5 w-5 text-green-600" />
                </div>
                Job Applications
                <div className="ml-auto flex items-center gap-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                    className="w-2 h-2 bg-green-500 rounded-full"
                  />
                  <span className="text-sm font-normal text-green-600">Live</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {jobApplications.length > 0 ? (
                  jobApplications.map((application) => (
                    <div key={application.id} className="p-4 bg-gradient-to-r from-gray-50 to-green-50/50 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{application.interested_department}</p>
                          <p className="text-sm text-gray-500">Applied: {formatDate(application.created_at)}</p>
                          {application.admin_notes && (
                            <p className="text-sm text-blue-600 mt-1 bg-blue-50 p-2 rounded">
                              Notes: {application.admin_notes}
                            </p>
                          )}
                        </div>
                        <div className="text-right ml-4">
                          <Badge className={`text-xs px-3 py-1 rounded-full border flex items-center gap-1 ${getStatusColor(application.status)}`}>
                            {getStatusIcon(application.status)}
                            {application.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="font-medium">No job applications yet</p>
                    <p className="text-sm">Check our careers page for opportunities</p>
                  </div>
                )}
              </div>
              <div className="mt-4 pt-4 border-t">
                <Link to="/careers">
                  <Button className="w-full" variant="outline">
                    <Briefcase className="h-4 w-4 mr-2" />
                    View Careers
                  </Button>
                </Link>
              </div>
            </CardContent>
          </AnimatedCard>
        </div>

        {/* Enhanced Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <AnimatedCard className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                </div>
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { to: '/request-quote', icon: FileText, title: 'Request Quote', desc: 'Get pricing for products', color: 'blue' },
                  { to: '/products', icon: ShoppingCart, title: 'Browse Products', desc: 'Explore our catalog', color: 'green' },
                  { to: '/catalog-request', icon: Package, title: 'Request Catalog', desc: 'Get detailed catalogs', color: 'purple' },
                  { to: '/contact', icon: MessageSquare, title: 'Contact Support', desc: 'Get help with orders', color: 'orange' }
                ].map((action, index) => (
                  <Link key={action.to} to={action.to} className="block">
                    <motion.div 
                      className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300 cursor-pointer text-center group"
                      whileHover={{ scale: 1.02, y: -2 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 + index * 0.1 }}
                    >
                      <div className={`p-3 bg-${action.color}-50 rounded-lg inline-block mb-3 group-hover:scale-110 transition-transform`}>
                        <action.icon className={`h-6 w-6 text-${action.color}-600`} />
                      </div>
                      <h3 className="font-medium text-gray-800 mb-1 group-hover:text-brand-blue transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600">{action.desc}</p>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </AnimatedCard>
        </motion.div>
      </div>
    </div>
  );
};

export default UserDashboard;
