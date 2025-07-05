
import React from 'react';
import Hero from '@/components/home/Hero';
import FeaturedCategories from '@/components/home/FeaturedCategories';
import { GlobalPresence } from '@/components/home/GlobalPresence';
import Testimonials from '@/components/home/Testimonials';

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero section handles its own padding to work with transparent navbar */}
      <Hero />
      
      {/* Other sections with proper spacing */}
      <div className="space-y-12 sm:space-y-16 lg:space-y-20">
        <FeaturedCategories />
        <GlobalPresence />
        <Testimonials />
      </div>
    </div>
  );
};

export default Index;
