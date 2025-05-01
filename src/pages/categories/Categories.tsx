
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const allCategories = [
  {
    id: 'agriculture',
    name: 'Agriculture & Food Products',
    description: 'Premium grains, spices, vegetables, fruits, and processed foods.',
    image: 'https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'textiles',
    name: 'Textiles & Fabrics',
    description: 'Handcrafted fabrics, garments, and home textiles with traditional artistry.',
    image: 'https://images.unsplash.com/photo-1618520422828-41a3e03f7ee0?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'electronics',
    name: 'Electronics & Components',
    description: 'Modern technology and electronic components meeting global standards.',
    image: 'https://images.unsplash.com/photo-1526406915894-7bcd65f60845?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'handicrafts',
    name: 'Handicrafts & Decor',
    description: 'Authentic handmade crafts, décor items, and artisanal products.',
    image: 'https://images.unsplash.com/photo-1503455637927-730bce8583c0?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'leather',
    name: 'Leather Products',
    description: 'Premium leather goods, footwear, and accessories.',
    image: 'https://images.unsplash.com/photo-1585457288043-7f871a128428?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'chemicals',
    name: 'Chemicals & Pharmaceuticals',
    description: 'Industrial chemicals, pharmaceutical ingredients, and formulations.',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=600&q=80',
  }
];

const Categories = () => {
  return (
    <div>
      <div className="bg-gradient-to-r from-brand-blue to-brand-blue/80 py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="url(#grid)" />
          </svg>
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-3xl md:text-5xl font-bold text-white text-center mb-2 animate-fade-in">
            Explore Our Expertly Curated Product Categories
          </h1>
          <p className="mt-4 text-lg text-white/90 text-center max-w-3xl mx-auto">
            We bring you a wide range of export-quality goods from India's finest manufacturers.
          </p>
        </div>
      </div>

      <div className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allCategories.map((category) => (
              <Link 
                to={`/categories/${category.id}`} 
                key={category.id} 
                className="group"
              >
                <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 border-0">
                  <div className="h-48 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                    <img 
                      src={category.image} 
                      alt={category.name} 
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <Badge className="absolute top-4 right-4 bg-brand-teal/80 backdrop-blur-sm z-20">
                      Export Ready
                    </Badge>
                  </div>
                  <CardContent className="p-6 bg-white">
                    <h3 className="text-xl font-semibold text-brand-blue mb-2">{category.name}</h3>
                    <p className="text-gray-600 mb-4">{category.description}</p>
                    <div className="flex items-center text-brand-teal font-medium mt-auto">
                      <span>Explore Category</span>
                      <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link to="/catalog-request">
              <Button className="bg-brand-teal hover:bg-brand-teal/90 px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                Request Full Product Catalogue
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
