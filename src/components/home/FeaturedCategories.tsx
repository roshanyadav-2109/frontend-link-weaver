
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { AnimatedCard } from '@/components/ui/animated-card';
import { motion } from 'framer-motion';

const categories = [
  {
    id: 'textiles',
    name: 'Textiles',
    description: 'Handcrafted fabrics, garments, and home textiles with traditional artistry.',
    image: 'https://images.unsplash.com/photo-1618520422828-41a3e03f7ee0?auto=format&fit=crop&w=800&q=80',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    id: 'electronics',
    name: 'Electronics',
    description: 'Modern technology and electronic components meeting global standards.',
    image: 'https://images.unsplash.com/photo-1526406915894-7bcd65f60845?auto=format&fit=crop&w=800&q=80',
    gradient: 'from-blue-500 to-cyan-500'
  }
];

const FeaturedCategories: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-brand-blue mb-4 flex items-center justify-center gap-2">
            <Sparkles className="h-8 w-8 text-brand-teal" />
            Explore Our Product Categories
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We bring you a wide range of export-quality goods—from fresh grains and spices to cutting-edge electronics and premium textiles.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category, index) => (
            <AnimatedCard
              key={category.id}
              delay={index * 0.2}
              className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl bg-white/80 backdrop-blur-sm"
            >
              <Link to={`/categories/${category.id}`}>
                <div className="relative h-48 overflow-hidden">
                  <motion.img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  />
                  
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  <motion.div 
                    className={`absolute inset-0 bg-gradient-to-r ${category.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
                  />
                  
                  <motion.div
                    className="absolute top-4 right-4 p-2 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <ArrowRight className="h-5 w-5 text-brand-blue" />
                  </motion.div>
                </div>
                
                <motion.div 
                  className="p-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-xl font-semibold text-brand-blue mb-2 group-hover:text-brand-teal transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  
                  <motion.div 
                    className="flex items-center text-brand-teal font-medium"
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span>Explore Category</span>
                    <ArrowRight size={16} className="ml-2" />
                  </motion.div>
                </motion.div>
              </Link>
            </AnimatedCard>
          ))}
        </div>
        
        <motion.div 
          className="text-center mt-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/categories">
              <button className="bg-gradient-to-r from-brand-blue to-brand-teal text-white px-8 py-3 rounded-lg hover:from-brand-teal hover:to-brand-blue transition-all duration-300 font-medium shadow-lg hover:shadow-xl">
                Explore All Products
                <motion.span
                  className="inline-block ml-2"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <ArrowRight className="h-5 w-5 inline" />
                </motion.span>
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
