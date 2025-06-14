
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Verified } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const allCategories = [
  {
    id: 'agriculture',
    name: 'Agriculture & Food Products',
    description: 'Premium grains, spices, vegetables, fruits, and processed foods with authentic Indian flavors.',
    image: 'https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?auto=format&fit=crop&w=600&q=80',
    productCount: '200+',
    rating: 4.8
  },
  {
    id: 'textiles',
    name: 'Textiles & Fabrics',
    description: 'Handcrafted fabrics, garments, and home textiles with traditional artistry and modern quality.',
    image: 'https://images.unsplash.com/photo-1618520422828-41a3e03f7ee0?auto=format&fit=crop&w=600&q=80',
    productCount: '150+',
    rating: 4.9
  },
  {
    id: 'electronics',
    name: 'Electronics & Components',
    description: 'Modern technology and electronic components meeting global standards and certifications.',
    image: 'https://images.unsplash.com/photo-1526406915894-7bcd65f60845?auto=format&fit=crop&w=600&q=80',
    productCount: '120+',
    rating: 4.7
  },
  {
    id: 'handicrafts',
    name: 'Handicrafts & Decor',
    description: 'Authentic handmade crafts, décor items, and artisanal products showcasing Indian heritage.',
    image: 'https://images.unsplash.com/photo-1503455637927-730bce8583c0?auto=format&fit=crop&w=600&q=80',
    productCount: '180+',
    rating: 4.9
  },
  {
    id: 'leather',
    name: 'Leather Products',
    description: 'Premium leather goods, footwear, and accessories crafted with traditional techniques.',
    image: 'https://images.unsplash.com/photo-1585457288043-7f871a128428?auto=format&fit=crop&w=600&q=80',
    productCount: '90+',
    rating: 4.8
  },
  {
    id: 'chemicals',
    name: 'Chemicals & Pharmaceuticals',
    description: 'Industrial chemicals, pharmaceutical ingredients, and formulations with quality certifications.',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=600&q=80',
    productCount: '80+',
    rating: 4.6
  }
];

const Categories = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Hero Section */}
      <div className="relative bg-gradient-to-br from-brand-blue via-brand-blue/95 to-brand-teal py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z" fill="%23ffffff" fill-opacity="0.1"/%3E%3C/svg%3E')] opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full mb-8 animate-fade-in">
              <Verified className="h-5 w-5 text-white mr-2" />
              <span className="text-white font-medium">Certified Export Quality</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in animate-delay-100 leading-tight">
              Explore Our Expertly 
              <span className="block bg-gradient-to-r from-yellow-200 to-white bg-clip-text text-transparent">
                Curated Product Categories
              </span>
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto animate-fade-in animate-delay-200">
              We bring you a wide range of export-quality goods from India's finest manufacturers, each product carefully selected for global standards.
            </p>
          </div>
        </div>
        
        {/* Wave Bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="h-12">
            <path d="M0 60L48 50C96 40 192 20 288 15C384 10 480 20 576 25C672 30 768 25 864 20C960 15 1056 15 1152 20C1248 25 1344 35 1392 40L1440 45V60H0V60Z" fill="#f9fafb"/>
          </svg>
        </div>
      </div>

      {/* Enhanced Categories Grid */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allCategories.map((category, index) => (
              <Link 
                to={`/categories/${category.id}`} 
                key={category.id} 
                className="group animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Card className="h-full overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 bg-white group-hover:-translate-y-2 transform">
                  <div className="relative h-56 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10"></div>
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex gap-2 z-20">
                      <Badge className="bg-brand-teal/90 text-white backdrop-blur-sm border-0">
                        Export Ready
                      </Badge>
                      <Badge className="bg-white/90 text-brand-blue backdrop-blur-sm border-0">
                        {category.productCount} Products
                      </Badge>
                    </div>
                    
                    {/* Rating */}
                    <div className="absolute top-4 right-4 flex items-center bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full z-20">
                      <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                      <span className="text-sm font-medium text-gray-900">{category.rating}</span>
                    </div>
                  </div>
                  
                  <CardContent className="p-8 bg-white">
                    <h3 className="text-2xl font-bold text-brand-blue mb-3 group-hover:text-brand-teal transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {category.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-brand-teal font-semibold">
                        <span>Explore Category</span>
                        <ArrowRight size={18} className="ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Verified className="h-4 w-4 mr-1" />
                        Verified
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Enhanced CTA Section */}
          <div className="mt-20 text-center">
            <div className="bg-gradient-to-r from-brand-blue to-brand-teal rounded-3xl p-12 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.1),transparent_50%)]"></div>
              <div className="relative z-10">
                <h3 className="text-3xl font-bold mb-4">Need Something Specific?</h3>
                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                  Can't find what you're looking for? Request our complete product catalogue with detailed specifications and pricing.
                </p>
                <Link to="/catalog-request">
                  <Button className="bg-white text-brand-blue hover:bg-gray-100 px-8 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 rounded-xl">
                    Request Full Product Catalogue
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
