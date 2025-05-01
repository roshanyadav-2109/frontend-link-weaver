
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
      <div className="bg-brand-blue py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white text-center">
            Explore Our Expertly Curated Product Categories
          </h1>
          <p className="mt-4 text-lg text-white/80 text-center max-w-3xl mx-auto">
            We bring you a wide range of export-quality goods from India's finest manufacturers.
          </p>
        </div>
      </div>

      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allCategories.map((category) => (
              <Link 
                to={`/categories/${category.id}`} 
                key={category.id} 
                className="group"
              >
                <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={category.image} 
                      alt={category.name} 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-semibold text-brand-blue mb-2">{category.name}</h3>
                    <p className="text-gray-600 mb-4 flex-grow">{category.description}</p>
                    <div className="flex items-center text-brand-teal font-medium mt-auto">
                      <span>Explore Category</span>
                      <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link to="/catalog-request">
              <Button className="bg-brand-teal hover:bg-brand-teal/90 px-8 py-6 text-lg">
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
