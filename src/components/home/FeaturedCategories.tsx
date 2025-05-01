
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const categories = [
  { 
    id: 'electronics', 
    name: 'Electronics', 
    description: 'Components, devices, and equipment for various applications',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&h=200'
  },
  { 
    id: 'machinery', 
    name: 'Machinery', 
    description: 'Industrial machines, tools, and equipment for manufacturing',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=300&h=200' 
  },
  { 
    id: 'building-materials', 
    name: 'Building Materials', 
    description: 'Construction materials, supplies, and hardware components',
    image: 'https://images.unsplash.com/photo-1459767129954-1b1c1f9b9ace?auto=format&fit=crop&w=300&h=200'
  },
  { 
    id: 'packaging', 
    name: 'Packaging', 
    description: 'Solutions for product protection, presentation, and shipping',
    image: 'https://images.unsplash.com/photo-1497604401993-f2e922e5cb0a?auto=format&fit=crop&w=300&h=200'
  },
  { 
    id: 'textiles', 
    name: 'Textiles', 
    description: 'Fabrics, fibers, and materials for various industries',
    image: 'https://images.unsplash.com/photo-1496307653780-42ee777d4833?auto=format&fit=crop&w=300&h=200'
  },
  { 
    id: 'chemicals', 
    name: 'Chemicals', 
    description: 'Industrial chemicals, compounds, and raw materials',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=300&h=200'
  },
];

const FeaturedCategories: React.FC = () => {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-brand-blue mb-4">Browse Product Categories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our comprehensive range of product categories from trusted manufacturers worldwide
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link 
              to={`/categories/${category.id}`} 
              key={category.id}
              className="group"
            >
              <div className="card h-full flex flex-col overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-brand-blue mb-2 group-hover:text-brand-teal transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <div className="mt-auto flex items-center text-brand-teal font-medium">
                    <span>Explore</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link to="/categories">
            <button className="btn-outline">
              View All Categories
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
