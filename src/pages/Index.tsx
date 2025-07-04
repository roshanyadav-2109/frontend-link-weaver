
import React from 'react';
import Hero from '@/components/home/Hero';
import FeaturedCategories from '@/components/home/FeaturedCategories';
import Testimonials from '@/components/home/Testimonials';
import { GlobalPresence } from '@/components/home/GlobalPresence';
import { BeamsBackground } from '@/components/ui/beams-background';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Star, Shield, Globe, TrendingUp } from 'lucide-react';

const Index: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full -mt-16">
      <BeamsBackground intensity="strong" />
      <div className="relative z-10">
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
                <div className="inline-flex items-center px-5 py-2 bg-brand-teal/10 rounded-full mb-7">
                  <Star className="h-6 w-6 text-brand-teal mr-2" />
                  <span className="text-brand-teal font-semibold text-lg">Trusted Worldwide</span>
                </div>
                <h2 className="text-5xl lg:text-6xl font-bold text-brand-blue mb-7 leading-tight font-playfair tracking-tight">
                  Your Trusted Partner in 
                  <span className="bg-gradient-to-r from-brand-teal to-brand-blue bg-clip-text text-transparent ml-2">
                    Global Trade
                  </span>
                </h2>
                <p className="text-2xl text-gray-700 mb-8 leading-relaxed font-sans font-normal">
                  Whether you're a manufacturer looking to showcase your products globally or a buyer seeking reliable Indian suppliers, 
                  Anantya Overseas provides the connections and support you need to succeed.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
                  {[
                    { icon: Shield, text: 'Curated, export-quality product catalogues' },
                    { icon: Globe, text: 'Direct connections with verified manufacturers' },
                    { icon: TrendingUp, text: 'End-to-end logistics support' },
                    { icon: Check, text: 'Custom sourcing solutions' }
                  ].map((item, index) => (
                    <div 
                      key={index} 
                      className="flex items-center group hover:bg-white hover:shadow-lg p-4 rounded-xl transition-all duration-300"
                    >
                      <div className="bg-brand-teal/10 p-3 rounded-lg mr-4 group-hover:bg-brand-teal group-hover:text-white transition-all duration-300">
                        <item.icon className="h-6 w-6 text-brand-teal group-hover:text-white" />
                      </div>
                      <span className="font-semibold text-lg text-gray-700">{item.text}</span>
                    </div>
                  ))}
                </div>
                <Link to="/products">
                  <Button 
                    className="bg-gradient-to-r from-brand-blue to-brand-teal text-white px-10 py-6 text-xl font-semibold rounded-xl shadow-2xl hover:from-brand-teal hover:to-brand-blue focus-visible:ring-4 focus-visible:ring-brand-blue/40 border-2 border-white/80 hover:border-brand-blue transition-all duration-300"
                    style={{
                      textShadow: "0 1px 10px rgba(0,0,0,0.35)",
                    }}
                  >
                    Explore Our Products 
                    <ArrowRight className="ml-3 h-6 w-6" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        <GlobalPresence />
        <Testimonials />
      </div>
    </div>
  );
};

export default Index;
