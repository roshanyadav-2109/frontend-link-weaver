
import React from 'react';
import { Play } from 'lucide-react';

const AboutUs: React.FC = () => {
  // Regions for global presence map
  const regions = [
    'United States', 'United Kingdom', 'India', 'China', 
    'South Africa', 'Southeast Asia', 'Middle East', 'Europe'
  ];

  // Founder data
  const founders = [
    {
      name: 'Roshan Kumar Singh',
      title: 'Co-founder, Anantya Overseas',
      description: 'Oversees global operations and logistics, ensuring strong supplier relationships and smooth trade operations.',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&h=200'
    },
    {
      name: 'Vishakh Agarwal',
      title: 'Co-founder, Anantya Overseas & Karo Startup; Software Engineer at HPE',
      description: 'Leads technological integration, bringing innovation and efficiency to the company\'s operations through automation and digital tools.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200'
    },
    {
      name: 'Tejash Mishra',
      title: 'Co-founder, Anantya Overseas',
      description: 'Focuses on market expansion and vendor sourcing, building scalable relationships with international clients and partners.',
      image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=200&h=200'
    }
  ];

  return (
    <div className="pt-16">
      {/* Hero section */}
      <div className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] bg-gradient-to-br from-brand-blue to-brand-teal overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200')] bg-cover bg-center"></div>
        <div className="container h-full mx-auto flex flex-col justify-center items-center text-center z-10 relative px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 text-shadow-lg animate-fade-in">
            About Us – Anantya Overseas
          </h1>
          <p className="text-white text-xl md:text-2xl max-w-3xl mx-auto text-shadow-md animate-fade-in animate-delay-100">
            Bridge the gap between high-quality Indian products and global markets
          </p>
        </div>
      </div>

      {/* Introduction section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="lg:w-1/2 animate-fade-in">
              <h2 className="text-3xl font-bold text-brand-blue mb-6">Our Story</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Anantya Overseas is a forward-thinking Indian export company with a mission to bridge the gap between high-quality Indian products and global markets. Specializing in electronics, textiles, and custom-sourced goods, we pride ourselves on delivering exceptional products at competitive prices with a focus on reliability and excellence.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our vision is to simplify international trade, making it accessible, efficient, and transparent for businesses around the world.
              </p>
            </div>
            <div className="lg:w-1/2 relative animate-fade-in animate-delay-200">
              <div className="aspect-video bg-black/10 rounded-lg shadow-premium flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-brand-blue/10 backdrop-blur-sm flex items-center justify-center">
                  <button 
                    className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-all shadow-xl hover:scale-105"
                    aria-label="Play brand video"
                  >
                    <Play size={32} className="text-brand-blue ml-1" />
                  </button>
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1551731409-43eb3e517a1a?auto=format&fit=crop&w=800&h=450" 
                  alt="Anantya Overseas Team" 
                  className="w-full h-full object-cover opacity-90"
                />
              </div>
              <p className="text-sm text-center mt-2 text-gray-500">A short brand video introducing our team, values, and operations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-brand-blue mb-8">Our Vision</h2>
            <div className="premium-glass-card p-8 mb-8">
              <p className="text-gray-700 leading-relaxed text-lg italic">
                "To become the most trusted and innovative Indian export company, providing reliable, high-quality products worldwide. We aim to foster long-term relationships built on transparency, trust, and exceptional service, contributing to the growth of businesses globally."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why choose us section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-brand-blue mb-12 text-center">Why Choose Anantya Overseas</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
            {[
              { title: 'Competitive Pricing', description: 'Delivering value with affordable pricing and no compromise on quality' },
              { title: 'Verified Quality', description: 'Each product undergoes thorough quality checks' },
              { title: 'Efficient Global Shipping', description: 'Smooth logistics to deliver on time, every time' },
              { title: 'Custom Sourcing', description: 'Sourcing tailored to your specific product needs' },
              { title: 'Dedicated Support', description: 'Transparent communication and customer-centric service' }
            ].map((feature, index) => (
              <div key={index} className="premium-card p-6 hover-lift">
                <h3 className="text-xl font-semibold text-brand-blue mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global presence section */}
      <section className="py-16 premium-gradient text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-white text-shadow-md">Our Global Presence</h2>
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="lg:w-1/2">
              <div className="premium-glass-card bg-white/10 p-6 rounded-lg">
                <p className="text-white mb-6 text-shadow-sm">
                  Anantya Overseas proudly serves clients in the following regions:
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {regions.map((region, index) => (
                    <div key={index} className="flex items-center p-2 bg-white/10 rounded-md backdrop-blur-sm">
                      <span className="h-2 w-2 bg-white rounded-full mr-2"></span>
                      <span className="text-shadow-sm">{region}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1589519160732-57fc6ea83edb?auto=format&fit=crop&w=800" 
                  alt="World Map" 
                  className="rounded-lg shadow-premium"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/50 to-transparent rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-brand-blue mb-12 text-center">Board of Founders</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {founders.map((founder, index) => (
              <div key={index} className="premium-depth-card p-6 text-center">
                <div className="w-32 h-32 mx-auto mb-6 overflow-hidden rounded-full shadow-premium-blue">
                  <img 
                    src={founder.image} 
                    alt={founder.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-brand-blue mb-2">{founder.name}</h3>
                <p className="text-brand-teal font-medium mb-4 text-sm">{founder.title}</p>
                <p className="text-gray-600 text-sm">{founder.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
