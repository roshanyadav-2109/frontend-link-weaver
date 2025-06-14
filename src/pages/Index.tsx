
import React from 'react';
import Hero from '@/components/home/Hero';
import FeaturedCategories from '@/components/home/FeaturedCategories';
import Testimonials from '@/components/home/Testimonials';
import { GlobalPresence } from '@/components/home/GlobalPresence';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Star, Shield, Globe, TrendingUp } from 'lucide-react';

const Index: React.FC = () => {
  return (
    <div className="overflow-hidden">
      <Hero />
      <FeaturedCategories />
      
      {/* Trust Section with Enhanced Design */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative">
        <div className="absolute inset-0 bg-gradient-radial opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 animate-fade-in">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-brand-blue/20 to-brand-teal/20 rounded-3xl blur-xl"></div>
                <img 
                  src="https://images.unsplash.com/photo-1578575437130-527eed3df6b6?auto=format&fit=crop&w=800&h=600" 
                  alt="Global Trade Partners" 
                  className="relative w-full h-auto rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
            <div className="lg:w-1/2 animate-fade-in animate-delay-200">
              <div className="inline-flex items-center px-4 py-2 bg-brand-teal/10 rounded-full mb-6">
                <Star className="h-5 w-5 text-brand-teal mr-2" />
                <span className="text-brand-teal font-medium">Trusted Worldwide</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-brand-blue mb-6 leading-tight">
                Your Trusted Partner in 
                <span className="bg-gradient-to-r from-brand-teal to-brand-blue bg-clip-text text-transparent"> Global Trade</span>
              </h2>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Whether you're a manufacturer looking to showcase your products globally or a buyer seeking reliable Indian suppliers, 
                Anantya Overseas provides the connections and support you need to succeed.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {[
                  { icon: Shield, text: 'Curated, export-quality product catalogues' },
                  { icon: Globe, text: 'Direct connections with verified manufacturers' },
                  { icon: TrendingUp, text: 'End-to-end logistics support' },
                  { icon: Check, text: 'Custom sourcing solutions' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center group hover:bg-white hover:shadow-lg p-4 rounded-xl transition-all duration-300">
                    <div className="bg-brand-teal/10 p-2 rounded-lg mr-4 group-hover:bg-brand-teal group-hover:text-white transition-all duration-300">
                      <item.icon className="h-5 w-5 text-brand-teal group-hover:text-white" />
                    </div>
                    <span className="font-medium text-gray-700">{item.text}</span>
                  </div>
                ))}
              </div>
              <Link to="/catalog-request">
                <Button className="bg-gradient-to-r from-brand-teal to-brand-blue hover:from-brand-blue hover:to-brand-teal text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                  Request Full Catalogue 
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <GlobalPresence />
      
      <Testimonials />
      
      {/* Enhanced CTA Section */}
      <section className="py-20 bg-gradient-to-r from-brand-blue via-brand-blue to-brand-teal relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="h-full w-full bg-dots-pattern"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full mb-8 animate-fade-in">
              <Globe className="h-5 w-5 text-white mr-2" />
              <span className="text-white font-medium">Join 500+ Global Businesses</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 animate-fade-in animate-delay-100">
              Ready to Start Your Global Trade Journey?
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-12 animate-fade-in animate-delay-200">
              Join hundreds of businesses already using Anantya Overseas to connect, discover products, and grow internationally.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 animate-fade-in animate-delay-300">
              <Link to="/auth/client">
                <Button className="bg-white text-brand-blue hover:bg-gray-100 px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 min-w-[200px]">
                  <Shield className="mr-2 h-5 w-5" />
                  Sign Up as Buyer
                </Button>
              </Link>
              <Link to="/auth/manufacturer">
                <Button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-brand-blue px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 min-w-[200px]">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Sign Up as Manufacturer
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
