
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SlideIn from '@/components/animations/SlideIn';
import { motion } from 'framer-motion';

const categories = [
  {
    id: 'textiles',
    name: 'Textiles',
    description: 'Handcrafted fabrics, garments, and home textiles with traditional artistry.',
    image: 'https://images.unsplash.com/photo-1618520422828-41a3e03f7ee0?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'electronics',
    name: 'Electronics',
    description: 'Modern technology and electronic components meeting global standards.',
    image: 'https://images.unsplash.com/photo-1526406915894-7bcd65f60845?auto=format&fit=crop&w=600&q=80',
  }
];

const FeaturedCategories: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <SlideIn direction="up" className="text-center mb-12">
          <h2 className="text-3xl font-bold text-brand-blue mb-4">Explore Our Product Categories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We bring you a wide range of export-quality goods—from fresh grains and spices to cutting-edge electronics and premium textiles.
          </p>
        </SlideIn>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category, index) => (
            <SlideIn 
              key={category.id} 
              direction={index % 2 === 0 ? 'left' : 'right'}
              delay={0.1 * (index + 1)}
            >
              <Link 
                to={`/categories/${category.id}`} 
                className="group"
              >
                <motion.div 
                  className="premium-card overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={category.image} 
                      alt={category.name} 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-brand-blue mb-2">{category.name}</h3>
                    <p className="text-gray-600 mb-4">{category.description}</p>
                    <div className="flex items-center text-brand-teal font-medium">
                      <span>Explore Category</span>
                      <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            </SlideIn>
          ))}
        </div>
        
        <SlideIn direction="up" delay={0.4} className="text-center mt-10">
          <Link to="/categories">
            <motion.button 
              className="bg-brand-blue text-white px-8 py-3 rounded-lg hover:bg-brand-blue/90 transition-colors font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore All Products
              <ArrowRight className="ml-2 h-5 w-5 inline" />
            </motion.button>
          </Link>
        </SlideIn>
      </div>
    </section>
  );
};

export default FeaturedCategories;
