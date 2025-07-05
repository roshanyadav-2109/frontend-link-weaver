
import React from 'react';
import Hero from '@/components/home/Hero';
import FeaturedCategories from '@/components/home/FeaturedCategories';
import { GlobalPresence } from '@/components/home/GlobalPresence';
import Testimonials from '@/components/home/Testimonials';
import PageTransition from '@/components/animations/PageTransition';
import FadeInSection from '@/components/animations/FadeInSection';

const Index = () => {
  return (
    <PageTransition className="min-h-screen">
      {/* Hero section handles its own padding to work with transparent navbar */}
      <Hero />
      
      {/* Other sections with proper spacing */}
      <div className="space-y-12 sm:space-y-16 lg:space-y-20">
        <FadeInSection delay={0.1}>
          <FeaturedCategories />
        </FadeInSection>
        
        <FadeInSection delay={0.2}>
          <GlobalPresence />
        </FadeInSection>
        
        <FadeInSection delay={0.3}>
          <Testimonials />
        </FadeInSection>
      </div>
    </PageTransition>
  );
};

export default Index;
