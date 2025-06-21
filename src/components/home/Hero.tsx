
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Users, Globe, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';

const Hero: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-blue-800 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%239C92AC%22%20fill-opacity=%220.05%22%3E%3Ccircle%20cx=%2230%22%20cy=%2230%22%20r=%221.5%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>

      <div className="relative z-10 container mx-auto px-4 pt-32 pb-20">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Left Content */}
          <div className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6 border border-white/20">
              <Star className="w-4 h-4 mr-2 text-yellow-400" />
              Trusted by 500+ Global Businesses
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Your Gateway to
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Global</span>
              <br />
              Trade Excellence
            </h1>

            {/* Subheading */}
            <p className="text-xl text-gray-300 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Connect with premium manufacturers, source quality products, and expand your business reach across international markets with confidence.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Link to="/products">
                <InteractiveHoverButton className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                  Explore Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </InteractiveHoverButton>
              </Link>
              
              <Link to="/auth/manufacturer">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold"
                >
                  <Users className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden sm:inline">Partner as </span>Manufacturer
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-white">500+</div>
                <div className="text-sm text-gray-400">Partners</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-white">50+</div>
                <div className="text-sm text-gray-400">Countries</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-white">99%</div>
                <div className="text-sm text-gray-400">Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Right Content - Visual Elements */}
          <div className="lg:w-1/2 relative">
            <div className="relative mx-auto max-w-lg">
              {/* Main floating card */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-4">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Global Network</h3>
                    <p className="text-gray-300 text-sm">Worldwide Connections</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Active Exports</span>
                    <span className="text-white font-semibold">2,847</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full w-3/4 animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-6 -right-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full p-3 shadow-lg animate-bounce">
                <Award className="w-6 h-6 text-white" />
              </div>
              
              <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full p-3 shadow-lg animate-pulse">
                <Users className="w-6 h-6 text-white" />
              </div>

              {/* Background decorative elements */}
              <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/4 right-1/4 w-20 h-20 bg-blue-500 rounded-full opacity-20 animate-ping"></div>
                <div className="absolute bottom-1/4 left-1/4 w-16 h-16 bg-purple-500 rounded-full opacity-20 animate-ping animation-delay-1000"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section with trust indicators */}
        <div className="mt-20 text-center">
          <p className="text-gray-400 mb-8">Trusted by leading companies worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-white/40 font-semibold text-lg">COMPANY</div>
            <div className="text-white/40 font-semibold text-lg">ENTERPRISE</div>
            <div className="text-white/40 font-semibold text-lg">GLOBAL</div>
            <div className="text-white/40 font-semibold text-lg">TRADE</div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
