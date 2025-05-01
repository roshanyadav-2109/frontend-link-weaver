
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const jobOpenings = [
  {
    id: 1,
    title: 'International Business Developer',
    department: 'Sales & Marketing',
    location: 'Mumbai, India',
    type: 'Full-time',
    description: "We're looking for an experienced International Business Developer to expand our global network of buyers and sellers.",
  },
  {
    id: 2,
    title: 'Supply Chain Specialist',
    department: 'Operations',
    location: 'Delhi, India',
    type: 'Full-time',
    description: 'Join our logistics team to ensure smooth operations between manufacturers and international buyers.',
  },
  {
    id: 3,
    title: 'Export Documentation Executive',
    department: 'Operations',
    location: 'Mumbai, India',
    type: 'Full-time',
    description: 'Manage export documentation and ensure compliance with international trade regulations.',
  },
  {
    id: 4,
    title: 'Digital Marketing Specialist',
    department: 'Marketing',
    location: 'Remote',
    type: 'Full-time',
    description: 'Drive our digital presence and help us reach more buyers and sellers through innovative marketing strategies.',
  },
  {
    id: 5,
    title: 'Customer Success Manager',
    department: 'Customer Support',
    location: 'Bangalore, India',
    type: 'Full-time',
    description: 'Ensure our clients have the best experience working with Anantya Overseas through proactive support.',
  }
];

const Careers = () => {
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
              
              <div className="space-y-6">
                {jobOpenings.map((job) => (
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
                ))}
              </div>
              
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
