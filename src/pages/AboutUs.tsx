
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
      {/* Hero section with improved design */}
      <div className="relative h-[60vh] md:h-[70vh] overflow-hidden bg-[#1a365d]">
        <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a365d]/80 to-[#2d507a]/70"></div>
        <div className="container h-full mx-auto flex flex-col justify-center items-center text-center z-10 relative px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 text-shadow-lg animate-fade-in leading-tight tracking-tight">
            About Us – Anantya Overseas
          </h1>
          <p className="text-white text-xl md:text-2xl max-w-3xl mx-auto text-shadow-md animate-fade-in animate-delay-100 bg-[#1a365d]/30 px-6 py-3 rounded-lg backdrop-blur-sm">
            Bridge the gap between high-quality Indian products and global markets
          </p>
        </div>
      </div>

      {/* Introduction section with improved design */}
      <section className="py-16 bg-gradient-to-b from-white to-[#f0f9ff]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="lg:w-1/2 animate-fade-in">
              <h2 className="text-3xl font-bold text-[#1a365d] mb-6 relative after:content-[''] after:absolute after:w-20 after:h-1 after:bg-[#2d6da3] after:rounded-full after:-bottom-2 after:left-0">Our Story</h2>
              <p className="text-gray-700 mb-6 leading-relaxed text-base md:text-lg">
                Anantya Overseas is a forward-thinking Indian export company with a mission to bridge the gap between high-quality Indian products and global markets. Specializing in electronics, textiles, and custom-sourced goods, we pride ourselves on delivering exceptional products at competitive prices with a focus on reliability and excellence.
              </p>
              <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                Our vision is to simplify international trade, making it accessible, efficient, and transparent for businesses around the world.
              </p>
            </div>
            <div className="lg:w-1/2 relative animate-fade-in animate-delay-200">
              <div className="aspect-video bg-black/10 rounded-lg shadow-premium overflow-hidden border border-blue-100">
                <div className="absolute inset-0 bg-[#1a365d]/10 backdrop-blur-sm flex items-center justify-center z-10">
                  <button 
                    className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-all shadow-xl hover:scale-105"
                    aria-label="Play brand video"
                  >
                    <Play size={32} className="text-[#1a365d] ml-1" />
                  </button>
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1551731409-43eb3e517a1a?auto=format&fit=crop&w=800&h=450" 
                  alt="Anantya Overseas Team" 
                  className="w-full h-full object-cover opacity-90"
                />
              </div>
              <p className="text-sm text-center mt-3 text-gray-600 font-medium">A short brand video introducing our team, values, and operations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision section with improved design */}
      <section className="py-16 bg-gradient-to-r from-[#f7fafd]/80 to-[#e5f0fd]/80">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-[#1a365d] mb-8 relative inline-block after:content-[''] after:absolute after:w-32 after:h-1 after:bg-[#2d6da3] after:rounded-full after:-bottom-2 after:left-1/2 after:-translate-x-1/2">Our Vision</h2>
            <div className="bg-white/70 backdrop-blur-md p-10 mb-8 shadow-premium rounded-2xl border border-blue-100">
              <p className="text-gray-700 leading-relaxed text-xl italic">
                "To become the most trusted and innovative Indian export company, providing reliable, high-quality products worldwide. We aim to foster long-term relationships built on transparency, trust, and exceptional service, contributing to the growth of businesses globally."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why choose us section with improved design */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#1a365d] mb-12 text-center relative after:content-[''] after:absolute after:w-32 after:h-1 after:bg-[#2d6da3] after:rounded-full after:-bottom-2 after:left-1/2 after:-translate-x-1/2">Why Choose Anantya Overseas</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
            {[
              { title: 'Competitive Pricing', description: 'Delivering value with affordable pricing and no compromise on quality' },
              { title: 'Verified Quality', description: 'Each product undergoes thorough quality checks' },
              { title: 'Efficient Global Shipping', description: 'Smooth logistics to deliver on time, every time' },
              { title: 'Custom Sourcing', description: 'Sourcing tailored to your specific product needs' },
              { title: 'Dedicated Support', description: 'Transparent communication and customer-centric service' }
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-premium border border-blue-50 hover:translate-y-[-5px] transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#1a365d] to-[#2d6da3] flex items-center justify-center mb-4 text-white font-bold text-xl">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold text-[#1a365d] mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global presence section with improved design */}
      <section className="py-16 bg-gradient-to-br from-[#1a365d] to-[#2d6da3] text-white relative overflow-hidden">
        {/* Background pattern for premium effect */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5"/>
                </pattern>
                <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                  <rect width="80" height="80" fill="url(#smallGrid)"/>
                  <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl font-bold mb-12 text-center text-white text-shadow-md relative after:content-[''] after:absolute after:w-32 after:h-1 after:bg-white/70 after:rounded-full after:-bottom-2 after:left-1/2 after:-translate-x-1/2">Our Global Presence</h2>
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="lg:w-1/2">
              <div className="bg-white/15 backdrop-blur-md border border-white/20 p-8 rounded-xl shadow-premium">
                <p className="text-white mb-6 text-shadow-sm text-lg font-medium">
                  Anantya Overseas proudly serves clients in the following regions:
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {regions.map((region, index) => (
                    <div key={index} className="flex items-center p-3 bg-white/10 rounded-md backdrop-blur-sm hover:bg-white/20 transition-all">
                      <span className="h-3 w-3 bg-white rounded-full mr-3"></span>
                      <span className="text-shadow-sm font-medium">{region}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="relative rounded-xl overflow-hidden shadow-premium border-2 border-white/30">
                <img 
                  src="https://images.unsplash.com/photo-1589519160732-57fc6ea83edb?auto=format&fit=crop&w=800" 
                  alt="World Map" 
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a365d]/70 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white text-shadow-md">
                  <h3 className="text-xl font-bold">Global Network</h3>
                  <p className="text-sm">Our presence across continents ensures reliable service worldwide</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder section with improved design */}
      <section className="py-16 bg-gradient-to-b from-[#f7fafd] to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#1a365d] mb-12 text-center relative after:content-[''] after:absolute after:w-32 after:h-1 after:bg-[#2d6da3] after:rounded-full after:-bottom-2 after:left-1/2 after:-translate-x-1/2">Board of Founders</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {founders.map((founder, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-premium border border-blue-50 hover:shadow-xl transition-all duration-300">
                <div className="h-48 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a365d]/80 to-transparent z-10"></div>
                  <img 
                    src={founder.image} 
                    alt={founder.name} 
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                    <h3 className="text-xl font-semibold text-white text-shadow-md">{founder.name}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-[#2d6da3] font-medium mb-4 text-sm">{founder.title}</p>
                  <p className="text-gray-700 text-sm leading-relaxed">{founder.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Mission Video section - NEW SECTION */}
      <section className="py-16 bg-gradient-to-b from-[#f0f9ff] to-white relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-[#1a365d] mb-12 text-center relative after:content-[''] after:absolute after:w-32 after:h-1 after:bg-[#2d6da3] after:rounded-full after:-bottom-2 after:left-1/2 after:-translate-x-1/2">Our Global Mission</h2>
            
            <div className="relative rounded-xl overflow-hidden shadow-premium-blue border border-blue-100">
              <div className="aspect-video bg-[#1a365d]/5 relative">
                {/* Video thumbnail with play button */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="p-4 bg-[#1a365d]/80 rounded-full backdrop-blur-sm">
                    <button 
                      className="w-20 h-20 rounded-full bg-white flex items-center justify-center hover:bg-[#f0f9ff] transition-all"
                      aria-label="Play mission video"
                    >
                      <Play size={36} className="text-[#1a365d] ml-1" />
                    </button>
                  </div>
                </div>
                
                {/* Video thumbnail image */}
                <img 
                  src="https://images.unsplash.com/photo-1504607798333-52a30db54a5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
                  alt="Anantya Overseas Global Mission" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="bg-white p-8">
                <h3 className="text-2xl font-bold text-[#1a365d] mb-2">Building Global Trade Bridges</h3>
                <p className="text-gray-700 mb-4">
                  Our mission extends beyond simply facilitating transactions. We're building lasting relationships that connect Indian manufacturers with global markets, fostering economic growth and international cooperation.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1 bg-[#f0f9ff] text-[#1a365d] rounded-full text-sm font-medium">Global Reach</span>
                  <span className="px-3 py-1 bg-[#f0f9ff] text-[#1a365d] rounded-full text-sm font-medium">Quality Focus</span>
                  <span className="px-3 py-1 bg-[#f0f9ff] text-[#1a365d] rounded-full text-sm font-medium">Ethical Trade</span>
                  <span className="px-3 py-1 bg-[#f0f9ff] text-[#1a365d] rounded-full text-sm font-medium">Innovation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
