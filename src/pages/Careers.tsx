
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Building2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface Career {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  status: string;
  apply_link: string | null;
  created_at: string;
}

const Careers: React.FC = () => {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Fetching active careers...');
    fetchCareers();
    
    // Set up real-time subscription
    console.log('Setting up real-time subscription for public careers...');
    const subscription = supabase
      .channel('public-careers')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'careers' }, 
        (payload) => {
          console.log('Real-time update received:', payload);
          fetchCareers();
        }
      )
      .subscribe((status) => {
        console.log('Public careers subscription status:', status);
      });

    return () => {
      console.log('Cleaning up public careers subscription...');
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchCareers = async () => {
    try {
      const { data, error } = await supabase
        .from('careers')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching careers:', error);
        toast.error('Failed to load career opportunities');
        return;
      }

      console.log('Careers fetched successfully:', data);
      setCareers(data || []);
    } catch (error) {
      console.error('Unexpected error fetching careers:', error);
      toast.error('Failed to load career opportunities');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (career: Career) => {
    if (career.apply_link) {
      window.open(career.apply_link, '_blank');
    } else {
      toast.info('Please contact us directly to apply for this position');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-brand-blue to-brand-teal text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Join Our Team
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Build your career with India's leading export company. We're always looking for talented individuals to join our growing team.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {careers.length > 0 ? (
            <div className="grid gap-6">
              {careers.map((career) => (
                <Card key={career.id} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl font-bold text-gray-800 mb-2">
                          {career.title}
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                          <div className="flex flex-wrap items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Building2 size={16} />
                              {career.department}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin size={16} />
                              {career.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock size={16} />
                              {career.type.charAt(0).toUpperCase() + career.type.slice(1)}
                            </div>
                          </div>
                        </CardDescription>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {career.status.charAt(0).toUpperCase() + career.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      {career.description}
                    </p>
                    
                    <div className="flex justify-end">
                      <Button 
                        onClick={() => handleApply(career)}
                        className="bg-brand-blue hover:bg-brand-blue/90 text-white flex items-center gap-2"
                      >
                        Apply Now
                        <ExternalLink size={16} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Building2 className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Open Positions
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                We don't have any open positions at the moment, but we're always interested in hearing from talented individuals. Please check back soon!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Careers;
