
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useRealtimeQuotes } from '@/hooks/useRealtimeQuotes';
import { AnimatedCard } from '@/components/ui/animated-card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  FileText, 
  User, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const UserDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const { quotes, loading } = useRealtimeQuotes();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'contacted':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'contacted':
        return <Clock className="h-4 w-4" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const recentQuotes = quotes.slice(0, 5);
  const completedQuotes = quotes.filter(q => q.status === 'completed').length;
  const pendingQuotes = quotes.filter(q => q.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {profile?.full_name || user?.email}!
          </h1>
          <p className="text-gray-600">Manage your quotes and track your orders</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <AnimatedCard delay={100}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Quotes</p>
                    <p className="text-2xl font-bold text-gray-900">{quotes.length}</p>
                  </div>
                  <div className="p-3 bg-brand-blue/10 rounded-full">
                    <FileText className="h-6 w-6 text-brand-blue" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedCard>

          <AnimatedCard delay={200}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">{pendingQuotes}</p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedCard>

          <AnimatedCard delay={300}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-green-600">{completedQuotes}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedCard>
        </div>

        {/* Recent Quotes */}
        <AnimatedCard delay={400}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Recent Quote Requests
                </CardTitle>
                <Link to="/dashboard/quotes">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : recentQuotes.length > 0 ? (
                <div className="space-y-4">
                  {recentQuotes.map((quote, index) => (
                    <div 
                      key={quote.id} 
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{quote.product_name}</h3>
                        <p className="text-sm text-gray-600">
                          Quantity: {quote.quantity} {quote.unit}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(quote.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`flex items-center gap-1 ${getStatusColor(quote.status || 'pending')}`}>
                          {getStatusIcon(quote.status || 'pending')}
                          {quote.status || 'pending'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No quote requests yet</p>
                  <Link to="/products">
                    <Button className="bg-brand-blue hover:bg-brand-blue/90">
                      Browse Products
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </AnimatedCard>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <AnimatedCard delay={500}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Update your profile information and preferences
                </p>
                <Link to="/auth/update-profile-client">
                  <Button variant="outline" className="w-full">
                    Update Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </AnimatedCard>

          <AnimatedCard delay={600}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Browse Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Discover our latest products and request quotes
                </p>
                <Link to="/products">
                  <Button className="w-full bg-brand-blue hover:bg-brand-blue/90">
                    View Products
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </AnimatedCard>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
