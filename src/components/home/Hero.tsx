
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Globe, Package, Shield, Star, Factory } from 'lucide-react';
import ManufacturerPartnershipForm from '@/components/ManufacturerPartnershipForm';

const Hero = () => {
  const [showPartnershipForm, setShowPartnershipForm] = useState(false);

  return (
    <div className="relative pt-28 pb-20 md:py-32 lg:py-40 overflow-hidden min-h-screen flex items-center bg-gradient-to-br from-brand-blue/95 via-brand-blue/90 to-brand-teal/85">
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full backdrop-blur-sm animate-float z-20 hidden lg:block"></div>
      <div className="absolute bottom-32 right-16 w-16 h-16 bg-brand-teal/20 rounded-full backdrop-blur-sm animate-float z-20 hidden lg:block" style={{animationDelay: '2s'}}></div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-20">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center px-6 py-3 rounded-full text-white text-sm bg-white/15 backdrop-blur-sm mb-8 animate-fade-in shadow-2xl border border-white/20">
            <Star className="mr-2 h-4 w-4 text-yellow-300" />
            Trusted by businesses in 20+ countries
            <Star className="ml-2 h-4 w-4 text-yellow-300" />
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight animate-fade-in animate-delay-100">
            Seamless Global Trade
            <span className="block bg-gradient-to-r from-brand-teal via-yellow-200 to-white bg-clip-text text-transparent">
              Connect. Source. Succeed.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl lg:text-3xl text-white/95 mb-12 animate-fade-in animate-delay-200 max-w-4xl mx-auto leading-relaxed font-light">
            Expand your reach with verified suppliers and world-class support. Trade confidently, anywhere.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mb-16 animate-fade-in animate-delay-300 px-4 sm:px-0">
            <Button
              asChild
              size="lg" 
              className="bg-white text-brand-blue hover:bg-gray-100 px-6 sm:px-10 py-6 sm:py-8 text-lg sm:text-xl font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2 rounded-2xl w-full sm:min-w-[220px] group"
            >
              <Link to="/products">
                <Package className="mr-2 sm:mr-3 h-5 sm:h-6 w-5 sm:w-6" />
                <span className="text-sm sm:text-base">Explore Products</span>
                <ArrowRight className="ml-2 sm:ml-3 h-5 sm:h-6 w-5 sm:w-6 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button 
              onClick={() => setShowPartnershipForm(true)}
              size="lg"
              className="bg-gradient-to-r from-brand-teal to-brand-blue text-white px-4 sm:px-10 py-6 sm:py-8 text-lg sm:text-xl font-semibold shadow-2xl hover:shadow-3xl hover:from-brand-blue hover:to-brand-teal transition-all duration-300 transform hover:-translate-y-2 rounded-2xl w-full sm:min-w-[220px] group border-2 border-white/80 focus-visible:ring-4 focus-visible:ring-brand-blue/40"
              style={{
                textShadow: "0 1px 10px rgba(0,0,0,0.35)",
              }}
            >
              <Factory className="mr-2 sm:mr-3 h-5 sm:h-6 w-5 sm:w-6 flex-shrink-0" />
              <span className="text-sm sm:text-base text-center leading-tight">Partner as Manufacturer</span>
              <ArrowRight className="ml-2 sm:ml-3 h-5 sm:h-6 w-5 sm:w-6 group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </Button>
          </div>
        </div>
        
        {/* Enhanced Trust Indicators */}
        <div className="mt-20 animate-fade-in animate-delay-400">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 px-4">
            {[
              { icon: Shield, text: "Verified Suppliers", desc: "100% Authenticated" },
              { icon: Package, text: "Quality Assured", desc: "Premium Standards" },
              { icon: Globe, text: "Global Shipping", desc: "Worldwide Delivery" },
              { icon: Star, text: "Premium Support", desc: "24/7 Assistance" }
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center text-center group hover:scale-110 transition-all duration-300">
                <div className="bg-white/15 backdrop-blur-sm p-4 rounded-2xl mb-3 group-hover:bg-white/25 transition-all duration-300 border border-white/20">
                  <item.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-white">
                  <div className="font-semibold text-lg">{item.text}</div>
                  <div className="text-white/80 text-sm">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Enhanced Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="h-16 md:h-20 lg:h-24">
          <path d="M0 120L48 105C96 90 192 60 288 55C384 50 480 70 576 75C672 80 768 70 864 65C960 60 1056 60 1152 70C1248 80 1344 100 1392 110L1440 120V120H0V120Z" fill="white"/>
        </svg>
      </div>

      {/* Manufacturer Partnership Form Modal */}
      <ManufacturerPartnershipForm
        isOpen={showPartnershipForm}
        onClose={() => setShowPartnershipForm(false)}
      />
    </div>
  );
};

export default Hero;
