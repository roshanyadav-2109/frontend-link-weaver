
import React from 'react';
import Hero from '@/components/home/Hero';
import FeaturedCategories from '@/components/home/FeaturedCategories';
import Testimonials from '@/components/home/Testimonials';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';

const Index: React.FC = () => {
  return (
    <div>
      <Hero />
      <FeaturedCategories />
      
      <section className="bg-brand-light section">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=600&h=400" 
                alt="Client and Manufacturer Collaboration" 
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-brand-blue mb-4">
                Streamline Your Procurement Process
              </h2>
              <p className="text-gray-700 mb-6">
                Whether you're a manufacturer looking to showcase your products or a client seeking quality suppliers, 
                LinkWeaver provides the tools and connections you need to succeed.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Access comprehensive product catalogs',
                  'Connect directly with verified manufacturers',
                  'Request customized product information',
                  'Streamline your procurement process'
                ].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-brand-teal mr-2" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/catalog-request">
                <Button className="bg-brand-teal hover:bg-brand-teal/90">
                  Request Full Catalog <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <Testimonials />
      
      <section className="bg-white section">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-brand-blue mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Join thousands of businesses already using LinkWeaver to connect, discover products, and grow their network.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/auth/client">
              <Button className="bg-brand-blue hover:bg-brand-blue/90 px-6">
                Sign Up as Client
              </Button>
            </Link>
            <Link to="/auth/manufacturer">
              <Button className="bg-brand-teal hover:bg-brand-teal/90 px-6">
                Sign Up as Manufacturer
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
