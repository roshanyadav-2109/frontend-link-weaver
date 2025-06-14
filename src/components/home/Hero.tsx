
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Globe, Package, Shield, Star } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative pt-28 pb-20 md:py-32 lg:py-40 overflow-hidden min-h-screen flex items-center">
      {/* Enhanced Background with Gradient Overlay */}
      <div className="absolute inset-0 w-full h-full z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/95 via-brand-blue/90 to-brand-teal/85 z-10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(44,122,123,0.3),transparent_50%)] z-10"></div>
        <video 
          className="absolute min-w-full min-h-full object-cover" 
          autoPlay 
          loop 
          muted 
          playsInline
          poster="https://images.unsplash.com/photo-1661956601030-fdfb9c7e9e2f?q=80&w=1342"
        >
          <source src="https://cdn.coverr.co/videos/coverr-aerial-shot-of-cargo-port-with-containers-8290/1080p.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      
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
            Global Trade, 
            <span className="block bg-gradient-to-r from-white via-yellow-200 to-brand-teal bg-clip-text text-transparent">
              Simplified
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl lg:text-3xl text-white/95 mb-12 animate-fade-in animate-delay-200 max-w-4xl mx-auto leading-relaxed font-light">
            Where exporters and buyers from across the world meet under one trusted roof. We help you source, ship, and scale—seamlessly.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16 animate-fade-in animate-delay-300">
            <Link to="/categories">
              <Button size="lg" className="bg-white text-brand-blue hover:bg-gray-100 px-10 py-8 text-xl font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2 rounded-2xl min-w-[220px] group">
                <Package className="mr-3 h-6 w-6" />
                Explore Products 
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/catalog-request">
              <Button size="lg" variant="outline" className="border-2 border-white/80 text-white hover:bg-white/10 backdrop-blur-sm px-10 py-8 text-xl font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2 rounded-2xl min-w-[220px] group">
                <Globe className="mr-3 h-6 w-6" />
                Request Catalogue
              </Button>
            </Link>
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
    </div>
  );
};

export default Hero;
