
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Globe, Package, Shield } from 'lucide-react';

const Hero = () => {
  return (
    <div className="bg-gradient-to-r from-brand-blue via-brand-blue/95 to-brand-blue/90 pt-28 pb-20 md:py-32 lg:py-40 relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute inset-0 opacity-20">
          {/* World map pattern */}
          <svg 
            width="100%" 
            height="100%" 
            viewBox="0 0 1920 1080" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg" 
            className="opacity-20"
            preserveAspectRatio="none"
          >
            <path 
              d="M950,80 Q1050,80 1050,180 T1150,280 T1250,380 T1350,480 T1450,580 T1550,680 T1650,780 T1750,880"
              stroke="white" 
              strokeWidth="8"
              fill="none"
            />
            <path 
              d="M150,880 Q250,880 250,780 T350,680 T450,580 T550,480 T650,380 T750,280 T850,180"
              stroke="white" 
              strokeWidth="8"
              fill="none"
            />
            <circle cx="950" cy="500" r="300" stroke="white" strokeWidth="4" fill="none" />
            <circle cx="950" cy="500" r="200" stroke="white" strokeWidth="3" fill="none" />
            <circle cx="950" cy="500" r="100" stroke="white" strokeWidth="2" fill="none" />
          </svg>
        </div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-1 rounded-full text-white text-sm bg-white/15 backdrop-blur-sm mb-4 animate-fade-in shadow-premium border border-white/20">
            Trusted by businesses in 20+ countries
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-on-dark mb-6 leading-tight animate-fade-in">
            Global Trade, <span className="text-gradient bg-gradient-to-r from-white via-white to-brand-teal">Heartfelt</span> Partnerships
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 animate-fade-in animate-delay-100 text-shadow-sm">
            Welcome to <span className="font-bold">Anantya Overseas</span>, where exporters and buyers from across the world meet under one trusted roof. We help you source, ship, and scale—seamlessly.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in animate-delay-200">
            <Link to="/categories">
              <Button size="lg" className="bg-white text-brand-blue hover:bg-white/90 px-8 py-6 text-lg shadow-premium-blue hover:shadow-xl transition-all duration-300 premium-btn">
                Explore Products <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/catalog-request">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg premium-btn">
                Request a Catalogue
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Trust indicators */}
        <div className="mt-16 flex items-center justify-center space-x-8 animate-fade-in animate-delay-300 px-4">
          <div className="hidden md:flex items-center space-x-2 text-white/90 hover:text-white transition-colors">
            <Shield className="h-5 w-5" />
            <span className="text-sm">Verified Suppliers</span>
          </div>
          <div className="hidden md:flex items-center space-x-2 text-white/90 hover:text-white transition-colors">
            <Package className="h-5 w-5" />
            <span className="text-sm">Quality Assured</span>
          </div>
          <div className="flex items-center space-x-2 text-white/90 hover:text-white transition-colors">
            <Globe className="h-5 w-5" />
            <span className="text-sm">Global Shipping</span>
          </div>
          <div className="flex items-center space-x-2 text-white/90 hover:text-white transition-colors">
            <Shield className="h-5 w-5" />
            <span className="text-sm">Premium Support</span>
          </div>
        </div>
      </div>
      
      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0 120L48 105C96 90 192 60 288 55C384 50 480 70 576 75C672 80 768 70 864 65C960 60 1056 60 1152 70C1248 80 1344 100 1392 110L1440 120V120H0V120Z" fill="white"/>
        </svg>
      </div>
    </div>
  );
};

export default Hero;
