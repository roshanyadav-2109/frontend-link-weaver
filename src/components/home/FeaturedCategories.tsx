
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimatedCard } from '@/components/ui/animated-card';

const FeaturedCategories = () => {
  const categories = [
    {
      id: 'textiles',
      title: 'Textiles & Fabrics',
      description: 'Premium quality fabrics, garments, and textile products from trusted manufacturers.',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      products: ['Cotton Products', 'Silk Products', 'Ready-made Garments', 'Home Textiles'],
      color: 'from-blue-500 to-purple-600'
    },
    {
      id: 'electronics',
      title: 'Electronics & Audio',
      description: 'Latest electronics, components, and audio equipment for all your technical needs.',
      image: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=300&fit=crop',
      products: ['Consumer Electronics', 'Industrial Equipment', 'Electronic Components', 'Accessories'],
      color: 'from-green-500 to-teal-600'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Categories
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our most popular product categories and find exactly what you're looking for.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {categories.map((category, index) => (
            <AnimatedCard key={category.id} delay={index * 200} hoverEffect="lift">
              <Card className="overflow-hidden group">
                <div className="relative">
                  <img 
                    src={category.image} 
                    alt={category.title}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-80`}></div>
                  <div className="absolute inset-0 flex items-end p-6">
                    <div className="text-white">
                      <h3 className="text-2xl font-bold mb-2">{category.title}</h3>
                      <p className="text-white/90 mb-4">{category.description}</p>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {category.products.map((product, idx) => (
                      <div 
                        key={product} 
                        className="text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2 animate-fade-in"
                        style={{ animationDelay: `${(index * 200) + (idx * 100)}ms` }}
                      >
                        {product}
                      </div>
                    ))}
                  </div>
                  
                  <Link to={`/products?category=${category.id}`}>
                    <Button 
                      className="w-full bg-brand-blue hover:bg-brand-blue/90 group transition-all duration-200 hover:scale-105"
                    >
                      Explore {category.title}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </AnimatedCard>
          ))}
        </div>

        <div className="text-center animate-fade-in" style={{ animationDelay: '600ms' }}>
          <Link to="/products">
            <Button size="lg" variant="outline" className="hover:scale-105 transition-all duration-200">
              View All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
