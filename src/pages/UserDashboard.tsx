import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

interface QuoteRequest {
  id: string;
  product_name: string;
  quantity: number;
  unit: string;
  status: string;
  created_at: string;
}

interface JobApplication {
  id: string;
  job_id: string;
  applicant_name: string;
  email: string;
  phone: string;
  status: string;
  created_at: string;
}

const UserDashboard = () => {
  const { user, profile } = useAuthStore();
  const [quoteRequests, setQuoteRequests] = useState<any[]>([]);
  const [jobApplications, setJobApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuoteRequests = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('quote_requests')
          .select('*')
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching quote requests:', error);
        } else {
          setQuoteRequests(data || []);
        }
      } catch (error) {
        console.error('Unexpected error fetching quote requests:', error);
      }
    };

    const fetchJobApplications = async () => {
      try {
        const { data, error } = await supabase
          .from('job_applications')
          .select('*')
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching job applications:', error);
        } else {
          setJobApplications(data || []);
        }
      } catch (error) {
        console.error('Unexpected error fetching job applications:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchQuoteRequests();
      fetchJobApplications();
    }
  }, [user]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const renderQuoteRequests = () => {
    if (loading) {
      return <p>Loading quote requests...</p>;
    }

    if (quoteRequests.length === 0) {
      return <p>No quote requests found.</p>;
    }

    return (
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {quoteRequests.map((request: QuoteRequest) => (
          <Card key={request.id} className="bg-white shadow-md rounded-md">
            <CardHeader>
              <CardTitle>Quote Request for: {request.product_name}</CardTitle>
              <CardDescription>
                Requested on {formatDate(request.created_at)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Quantity: {request.quantity} {request.unit}</p>
              <Badge variant={getStatusVariant(request.status)}>
                {request.status}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderJobApplications = () => {
    if (loading) {
      return <p>Loading job applications...</p>;
    }

    if (jobApplications.length === 0) {
      return <p>No job applications found.</p>;
    }

    return (
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {jobApplications.map((application: JobApplication) => (
          <Card key={application.id} className="bg-white shadow-md rounded-md">
            <CardHeader>
              <CardTitle>Job Application: {application.applicant_name}</CardTitle>
              <CardDescription>
                Applied on {formatDate(application.created_at)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Email: {application.email}</p>
              <p>Phone: {application.phone}</p>
              <Badge variant={getStatusVariant(application.status)}>
                {application.status}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-6">
        Welcome to Your Dashboard, {profile?.full_name}!
      </h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Quote Requests</h2>
        {renderQuoteRequests()}
        <Button asChild>
          <Link to="/request-quote">Request a New Quote</Link>
        </Button>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Job Applications</h2>
        {renderJobApplications()}
      </section>
    </div>
  );
};

export default UserDashboard;
