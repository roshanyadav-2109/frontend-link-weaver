
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  status: string;
}

const Careers = () => {
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch jobs from Supabase with improved error handling
  const fetchJobs = async () => {
    try {
      console.log('Fetching active careers...');
      const { data, error } = await supabase
        .from('careers')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching careers:', error);
        throw error;
      }
      
      console.log('Careers fetched successfully:', data);
      setJobs(data as JobOpening[]);
    } catch (err: any) {
      console.error('Error in fetchJobs:', err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // Listen for real-time updates with improved subscription
  useEffect(() => {
    fetchJobs();
    
    console.log('Setting up real-time subscription for public careers...');
    const channel = supabase
      .channel('realtime-careers-public')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'careers',
        },
        (payload) => {
          console.log('Real-time careers update received on public page:', payload);
          fetchJobs(); // Re-fetch to ensure we only show active jobs
        }
      )
      .subscribe((status) => {
        console.log('Public careers subscription status:', status);
      });
    
    return () => {
      console.log('Cleaning up public careers subscription...');
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div>
      <div className="bg-brand-blue py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white text-center">
            Join the Team That Moves the World
          </h1>
          <p className="mt-4 text-lg text-white/80 text-center max-w-3xl mx-auto">
            Anantya Overseas is built by people who believe in global impact. Check out our current openings in sourcing, logistics, tech, and customer support.
          </p>
        </div>
      </div>
      
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="col-span-2">
              <h2 className="text-2xl font-bold text-brand-blue mb-8">
                Current Openings
              </h2>
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="animate-spin w-8 h-8 mr-2 text-brand-blue" />
                  <span>Loading jobs…</span>
                </div>
              ) : (
                <div className="space-y-6">
                  {jobs.length === 0 ? (
                    <div className="text-gray-500 text-center py-12">
                      No active job openings found. Please check back later.
                    </div>
                  ) : (
                    jobs.map((job) => (
                      <div key={job.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className="p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-xl font-semibold text-brand-blue">{job.title}</h3>
                              <p className="text-gray-600 mt-1">{job.department} • {job.location} • {job.type}</p>
                            </div>
                            <Button variant="outline" className="text-brand-teal border-brand-teal hover:bg-brand-teal hover:text-white">
                              Apply Now
                            </Button>
                          </div>
                          <p className="mt-4 text-gray-700">{job.description}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
              <div className="mt-10 bg-gray-50 p-6 rounded-lg border">
                <h3 className="text-xl font-semibold text-brand-blue">Don't see the right role?</h3>
                <p className="mt-2 text-gray-700">
                  We're always looking for talented individuals to join our team. Send us your resume and we'll keep you in mind for future opportunities.
                </p>
                <Button className="mt-4 bg-brand-teal hover:bg-brand-teal/90">
                  Submit General Application
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <div className="bg-gray-50 p-6 rounded-lg border sticky top-6">
                <h2 className="text-xl font-bold text-brand-blue mb-4">
                  Why Work With Us?
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Global Impact</h3>
                    <p className="text-gray-600 text-sm">
                      Be part of a team that facilitates international trade and connects businesses across borders.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Growth Opportunities</h3>
                    <p className="text-gray-600 text-sm">
                      Develop your skills in a fast-growing company with opportunities for advancement.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Diverse Environment</h3>
                    <p className="text-gray-600 text-sm">
                      Work in a multicultural team with connections to businesses around the world.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Competitive Benefits</h3>
                    <p className="text-gray-600 text-sm">
                      Enjoy competitive salary, health benefits, and performance bonuses.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Work-Life Balance</h3>
                    <p className="text-gray-600 text-sm">
                      We believe in maintaining a healthy balance between work and personal life.
                    </p>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold mb-2">Our Culture</h3>
                  <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80"
                    alt="Team at Anantya Overseas"
                    className="w-full h-auto rounded-md mb-4"
                  />
                  <p className="text-gray-600 text-sm">
                    At Anantya Overseas, we foster a culture of collaboration, innovation, and respect for diverse perspectives.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-brand-blue py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Join Our Global Trade Mission?
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-6">
            Apply for one of our open positions today and become part of a team that's connecting businesses around the world.
          </p>
          <Button size="lg" className="bg-white text-brand-blue hover:bg-white/90">
            Explore Career Opportunities
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Careers;
