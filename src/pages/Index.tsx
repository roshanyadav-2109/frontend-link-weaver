
import React from 'react';
import Hero from '@/components/home/Hero';
import FeaturedCategories from '@/components/home/FeaturedCategories';
import Testimonials from '@/components/home/Testimonials';
import { GlobalPresence } from '@/components/home/GlobalPresence';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';

const Index: React.FC = () => {
  return (
    <div>
      <Hero />
      <FeaturedCategories />
      
      <section className="bg-white section py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1578575437130-527eed3df6b6?auto=format&fit=crop&w=600&h=400" 
                alt="Global Trade Partners" 
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-brand-blue mb-4">
                Your Trusted Partner in Global Trade
              </h2>
              <p className="text-gray-700 mb-6">
                Whether you're a manufacturer looking to showcase your products globally or a buyer seeking reliable Indian suppliers, 
                Anantya Overseas provides the connections and support you need to succeed.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Curated, export-quality product catalogues',
                  'Direct connections with verified manufacturers',
                  'End-to-end logistics support',
                  'Custom sourcing solutions'
                ].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-brand-teal mr-2" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/catalog-request">
                <Button className="bg-brand-teal hover:bg-brand-teal/90">
                  Request Full Catalogue <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <GlobalPresence />
      
      <Testimonials />
      
      <section className="bg-white section py-16">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-brand-blue mb-4">
            Ready to Start Your Global Trade Journey?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Join hundreds of businesses already using Anantya Overseas to connect, discover products, and grow internationally.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/auth/client">
              <Button className="bg-brand-blue hover:bg-brand-blue/90 px-6">
                Sign Up as Buyer
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
