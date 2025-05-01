
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <div className="bg-gradient-to-r from-brand-blue to-brand-teal py-16 md:py-20 lg:py-24 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-pattern opacity-10 z-0"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Global Trade, Heartfelt Partnerships
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8">
            Welcome to <span className="font-bold">Anantya Overseas</span>, where exporters and buyers from across the world meet under one trusted roof. We help you source, ship, and scale—seamlessly.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/categories">
              <Button size="lg" className="bg-white text-brand-blue hover:bg-white/90">
                Explore Products
              </Button>
            </Link>
            <Link to="/catalog-request">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Request a Catalogue
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
