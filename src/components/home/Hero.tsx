
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Globe, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-brand-blue via-brand-teal to-brand-blue overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative container mx-auto px-4 pt-32 pb-16">
        <div className="flex flex-col lg:flex-row items-center justify-between min-h-[80vh]">
          {/* Left Content */}
          <div className="lg:w-1/2 text-white mb-12 lg:mb-0">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Global Sourcing
                <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent animate-pulse">
                  Simplified
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed animate-fade-in" style={{ animationDelay: '200ms' }}>
                Connect with trusted manufacturers worldwide. Quality products, competitive prices, seamless experience.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-fade-in" style={{ animationDelay: '400ms' }}>
                <Link to="/products">
                  <Button 
                    size="lg" 
                    className="bg-white text-brand-blue hover:bg-white/90 transition-all duration-300 hover:scale-105 group"
                  >
                    Explore Products
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/request-quote">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-white text-white hover:bg-white hover:text-brand-blue transition-all duration-300 hover:scale-105"
                  >
                    Request Quote
                  </Button>
                </Link>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '600ms' }}>
                <div className="flex items-center space-x-3 group">
                  <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                    <Globe className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Global Reach</h3>
                    <p className="text-sm text-white/80">Worldwide suppliers</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 group">
                  <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Quality Assured</h3>
                    <p className="text-sm text-white/80">Verified products</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 group">
                  <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                    <Zap className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Fast Delivery</h3>
                    <p className="text-sm text-white/80">Quick turnaround</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="lg:w-1/2 relative animate-fade-in" style={{ animationDelay: '800ms' }}>
            <div className="relative">
              {/* Main hero image */}
              <div className="relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=400&fit=crop&crop=center"
                  alt="Global business and logistics"
                  className="rounded-2xl shadow-2xl w-full h-96 object-cover animate-scale-in"
                />
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-white/20 backdrop-blur-sm rounded-xl p-4 animate-slide-in-right" style={{ animationDelay: '1s' }}>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">500+</div>
                  <div className="text-sm text-white/80">Global Partners</div>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-white/20 backdrop-blur-sm rounded-xl p-4 animate-slide-in-right" style={{ animationDelay: '1.2s' }}>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">24/7</div>
                  <div className="text-sm text-white/80">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 animate-fade-in" style={{ animationDelay: '1.4s' }}>
          <p className="text-white/80 mb-4">Ready to get started?</p>
          <Link to="/auth/initial">
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-brand-blue transition-all duration-300 hover:scale-105"
            >
              Join Our Platform
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
