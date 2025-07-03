
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Globe, Package, Shield, Star, Factory, Sparkles } from 'lucide-react';
import ManufacturerPartnershipForm from '@/components/ManufacturerPartnershipForm';
import { motion } from 'framer-motion';

const Hero = () => {
  const [showPartnershipForm, setShowPartnershipForm] = useState(false);

  return (
    <div className="relative pt-28 pb-20 md:py-32 lg:py-40 overflow-hidden min-h-screen flex items-center bg-gradient-to-br from-brand-blue/95 via-brand-blue/90 to-brand-teal/85">
      {/* Enhanced Floating Elements with Animation */}
      <motion.div 
        className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full backdrop-blur-sm z-20 hidden lg:block"
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 180, 360]
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      />
      
      <motion.div 
        className="absolute bottom-32 right-16 w-16 h-16 bg-brand-teal/20 rounded-full backdrop-blur-sm z-20 hidden lg:block"
        animate={{ 
          y: [0, 15, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 2
        }}
      />

      <motion.div 
        className="absolute top-1/2 right-1/4 w-8 h-8 bg-yellow-300/30 rounded-full backdrop-blur-sm z-20 hidden xl:block"
        animate={{ 
          x: [0, 20, 0],
          opacity: [0.3, 0.8, 0.3]
        }}
        transition={{ 
          duration: 5, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 1
        }}
      />
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-20">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div 
            className="inline-flex items-center px-6 py-3 rounded-full text-white text-sm bg-white/15 backdrop-blur-sm mb-8 shadow-2xl border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Star className="mr-2 h-4 w-4 text-yellow-300" />
            Trusted by businesses in 20+ countries
            <Star className="ml-2 h-4 w-4 text-yellow-300" />
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Seamless Global Trade
            </motion.span>
            <motion.span 
              className="block bg-gradient-to-r from-brand-teal via-yellow-200 to-white bg-clip-text text-transparent"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              Connect. Source. Succeed.
            </motion.span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl lg:text-3xl text-white/95 mb-12 max-w-4xl mx-auto leading-relaxed font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            Expand your reach with verified suppliers and world-class support. Trade confidently, anywhere.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mb-16 px-4 sm:px-0"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                asChild
                size="lg" 
                className="bg-white text-brand-blue hover:bg-gray-100 px-6 sm:px-10 py-6 sm:py-8 text-lg sm:text-xl font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-2xl w-full sm:min-w-[220px] group"
              >
                <Link to="/products">
                  <Package className="mr-2 sm:mr-3 h-5 sm:h-6 w-5 sm:w-6" />
                  <span className="text-sm sm:text-base">Explore Products</span>
                  <motion.div
                    className="ml-2 sm:ml-3"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <ArrowRight className="h-5 sm:h-6 w-5 sm:w-6" />
                  </motion.div>
                </Link>
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={() => setShowPartnershipForm(true)}
                size="lg"
                className="bg-gradient-to-r from-brand-teal to-brand-blue text-white px-4 sm:px-10 py-6 sm:py-8 text-lg sm:text-xl font-semibold shadow-2xl hover:shadow-3xl hover:from-brand-blue hover:to-brand-teal transition-all duration-300 rounded-2xl w-full sm:min-w-[220px] group border-2 border-white/80"
                style={{
                  textShadow: "0 1px 10px rgba(0,0,0,0.35)",
                }}
              >
                <Factory className="mr-2 sm:mr-3 h-5 sm:h-6 w-5 sm:w-6 flex-shrink-0" />
                <span className="text-sm sm:text-base text-center leading-tight">Partner as Manufacturer</span>
                <Sparkles className="ml-2 sm:ml-3 h-5 sm:h-6 w-5 sm:w-6 flex-shrink-0" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Enhanced Trust Indicators */}
        <motion.div 
          className="mt-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
        >
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 px-4">
            {[
              { icon: Shield, text: "Verified Suppliers", desc: "100% Authenticated", color: "from-green-400 to-emerald-500" },
              { icon: Package, text: "Quality Assured", desc: "Premium Standards", color: "from-blue-400 to-cyan-500" },
              { icon: Globe, text: "Global Shipping", desc: "Worldwide Delivery", color: "from-purple-400 to-pink-500" },
              { icon: Star, text: "Premium Support", desc: "24/7 Assistance", color: "from-yellow-400 to-orange-500" }
            ].map((item, index) => (
              <motion.div 
                key={index} 
                className="flex flex-col items-center text-center group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8 + index * 0.1 }}
                whileHover={{ scale: 1.1, y: -5 }}
              >
                <motion.div 
                  className="bg-white/15 backdrop-blur-sm p-4 rounded-2xl mb-3 group-hover:bg-white/25 transition-all duration-300 border border-white/20 relative overflow-hidden"
                  whileHover={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-20 group-hover:opacity-30 transition-opacity`} />
                  <item.icon className="h-8 w-8 text-white relative z-10" />
                </motion.div>
                <div className="text-white">
                  <div className="font-semibold text-lg">{item.text}</div>
                  <div className="text-white/80 text-sm">{item.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      
      {/* Enhanced Bottom Wave */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="h-16 md:h-20 lg:h-24">
          <motion.path 
            d="M0 120L48 105C96 90 192 60 288 55C384 50 480 70 576 75C672 80 768 70 864 65C960 60 1056 60 1152 70C1248 80 1344 100 1392 110L1440 120V120H0V120Z" 
            fill="white"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 2.2, duration: 1.5 }}
          />
        </svg>
      </motion.div>

      {/* Manufacturer Partnership Form Modal */}
      <ManufacturerPartnershipForm
        isOpen={showPartnershipForm}
        onClose={() => setShowPartnershipForm(false)}
      />
    </div>
  );
};

export default Hero;
